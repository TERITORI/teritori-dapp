package main

import (
	"flag"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerhandler"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/pricespb"
	"github.com/TERITORI/teritori-dapp/go/pkg/quests"
	"github.com/TERITORI/teritori-dapp/go/pkg/tmws"
	"github.com/allegro/bigcache/v3"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"gorm.io/gorm"
)

type ReplayInfo struct {
	StartHeight       int64
	FinalHeight       int64
	WebsocketEndpoint string
}

// One assumption of this code is that there is at least one transaction of interest in the chain

func main() {
	// handle args
	fs := flag.NewFlagSet("teritori-indexer", flag.ContinueOnError)
	var (
		chunkSize                   = fs.Int64("chunk-size", 10000, "maximum number of blocks to query from tendermint at once")
		txsBatchSize                = fs.Int("txs-batch-size", 10000, "maximum number of txs per query page")
		pollDelay                   = fs.Duration("poll-delay", 2*time.Second, "delay between tail queries")
		minterCodeIDs               = fs.String("teritori-minter-code-ids", "", "code ids of teritori minter contracts")
		dbHost                      = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort                      = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass                      = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName                      = fs.String("database-name", "", "database name for postgreSQL")
		dbUser                      = fs.String("postgres-user", "", "username for postgreSQL")
		tendermintWebsocketEndpoint = fs.String("tendermint-websocket-endpoint", "", "tendermint websocket endpoint")
		tailSize                    = fs.Int64("tail-size", 8640, "x blocks tail size means that the tendermint indexer can lag x blocks behind before the indexer misses an event")
		pricesServiceURI            = fs.String("prices-service-uri", "localhost:9091", "price service URI")
		insecurePrices              = fs.Bool("prices-insecure-grpc", false, "do not use TLS to connect to prices service")
		networksFile                = fs.String("networks-file", "networks.json", "path to networks config file")
		networkID                   = fs.String("indexer-network-id", "teritori", "network id to index")
		// TODO: Add this mode to support of indexing p2e independly from the rest and vice-versa
		// This is the temporary way to finish quickly p2e feature. We should rethink of indexing p2e more efficiently when having time
		mode = fs.String("indexer-mode", "", "the mode to run indexer: p2e, data. p2e: index only p2e, data: index all data without p2e")
	)
	if err := ff.Parse(fs, os.Args[1:],
		ff.WithEnvVars(),
		ff.WithIgnoreUndefined(true),
		ff.WithConfigFile(".env"),
		ff.WithConfigFileParser(ff.EnvParser),
		ff.WithAllowMissingConfigFile(true),
	); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	if *tendermintWebsocketEndpoint == "" {
		panic(errors.New("missing tendermint-websocket-endpoint flag"))
	}

	var indexerMode indexerdb.IndexerMode

	switch *mode {
	case string(indexerdb.IndexerModeData):
		indexerMode = indexerdb.IndexerModeData
	case string(indexerdb.IndexerModeP2E):
		indexerMode = indexerdb.IndexerModeP2E
	default:
		panic("missing indexer-mode or mode is not valid. Only support: p2e, data")
	}

	// load networks
	networksBytes, err := os.ReadFile(*networksFile)
	if err != nil {
		panic(errors.Wrap(err, "failed to read networks config file"))
	}
	netstore, err := networks.UnmarshalNetworkStore(networksBytes)
	if err != nil {
		panic(errors.Wrap(err, "failed to unmarshal networks config"))
	}

	// get and validate selected network
	network := netstore.MustGetCosmosNetwork(*networkID)
	if network.VaultContractAddress == "" {
		panic(errors.New("missing vaultContractAddress in network config"))
	}
	if network.NameServiceContractAddress == "" {
		panic(errors.New("missing nameServiceContractAddress in network config"))
	}
	// TODO: check other used fields

	// parse minter code ids
	mcisParts := strings.Split(*minterCodeIDs, ",")
	mcis := make([]uint64, len(mcisParts))
	for i, mciStr := range mcisParts {
		mcis[i], err = strconv.ParseUint(strings.TrimFunc(mciStr, unicode.IsSpace), 10, 64)
		if err != nil {
			panic(errors.Wrap(err, "failed to parse minter code ID"))
		}
	}

	// create replay infos
	replayInfos := []ReplayInfo{
		/*{
			StartHeight:       0,
			FinalHeight:       1154235,
			WebsocketEndpoint: "wss://teritorid.65.108.73.219.nip.io/rpc/websocket",
		},*/
		{
			//StartHeight:       1154236,
			StartHeight:       0,
			FinalHeight:       -1,
			WebsocketEndpoint: *tendermintWebsocketEndpoint,
		},
	}

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}
	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}

	if network.SocialFeedContractAddress == "" {
		panic(errors.New("missing social feed contract address"))
	}

	// create block time cache
	blockTimeCacheConfig := bigcache.DefaultConfig(time.Duration(0))
	blockTimeCacheConfig.HardMaxCacheSize = 10
	blockTimeCache, err := bigcache.NewBigCache(blockTimeCacheConfig)
	if err != nil {
		panic(errors.Wrap(err, "failed to init block time cache"))
	}

	// create prices service client
	popts := []grpc.DialOption{}
	if *insecurePrices {
		popts = append(popts, grpc.WithInsecure())
	} else {
		popts = append(popts, grpc.WithTransportCredentials(credentials.NewTLS(nil)))
	}
	pconn, err := grpc.Dial(*pricesServiceURI, popts...)
	if err != nil {
		panic(errors.Wrap(err, "failed to connect to price service"))
	}
	ps := pricespb.NewPricesServiceClient(pconn)

	// init db
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	err = indexerdb.MigrateDB(db)
	if err != nil {
		panic(errors.Wrap(err, "failed migrate database models"))
	}

	// init/get height
	dbApp := indexerdb.App{
		IndexerMode: indexerMode,
		NetworkID:   network.ID,
	}
	if err := db.Where(indexerdb.App{IndexerMode: indexerMode, NetworkID: network.ID}).FirstOrCreate(&dbApp).Error; err != nil {
		panic(errors.Wrap(err, "failed to get or create db app"))
	}
	initialHeight := dbApp.Height
	startTime := time.Now()
	lastSnapshotHeight := initialHeight
	lastSnapshotTime := time.Now()
	bpsContinuous := float64(0)

	lastProcessedHeight := dbApp.Height
	lastProcessedHash := dbApp.TxHash
	chunkedHeight := dbApp.ChunkedHeight

	// inject quests
	qs, err := quests.Quests()
	if err != nil {
		panic(errors.Wrap(err, "failed to get embedded quests"))
	}
	for _, q := range qs {
		db.Save(&indexerdb.Quest{
			ID:        q.ID,
			Title:     q.Title,
			NetworkID: *networkID,
		})
	}

	// stats
	statIntervalSeconds := 10
	statContinuousSamples := 60
	nextStatsPrint := time.Now().Add(time.Duration(statIntervalSeconds) * time.Second)
	tryPrintStats := func(chainHeight int64, lastProcessedBlock int64) {
		now := time.Now()
		if nextStatsPrint.Before(now) {
			totalProcessedBlocks := lastProcessedBlock - initialHeight
			elapsedTime := now.Sub(startTime).Seconds()
			bpsTotal := float64(totalProcessedBlocks) / elapsedTime

			processedBlocks := lastProcessedBlock - lastSnapshotHeight
			bpsInstant := float64(processedBlocks) / float64(now.Sub(lastSnapshotTime).Seconds())

			bpsContinuous = (bpsContinuous * (float64(statContinuousSamples - 1)) / float64(statContinuousSamples)) + (bpsInstant / float64(statContinuousSamples))

			remainingBlocks := chainHeight - lastProcessedBlock
			eta := time.Duration((float64(remainingBlocks) / bpsContinuous) * 1000000000)

			logger.Info("sync stats", zap.Duration("eta", eta), zap.Int64("remaining-blocks", remainingBlocks), zap.Float64("bps-instant", math.Round(bpsInstant*100)/100), zap.Float64("bps-continuous", math.Round(bpsContinuous*100)/100), zap.Float64("bps-session", math.Round(bpsTotal*100)/100))

			nextStatsPrint = now.Add(time.Duration(statIntervalSeconds) * time.Second)
			lastSnapshotHeight = lastProcessedBlock
			lastSnapshotTime = now
		}
	}

	// find replay info to use
	var runReplayInfos []ReplayInfo
	for i, replayInfo := range replayInfos {
		if replayInfo.StartHeight <= chunkedHeight && (replayInfo.FinalHeight == -1 || chunkedHeight <= replayInfo.FinalHeight) {
			runReplayInfos = replayInfos[i:]
			break
		}
	}
	if len(runReplayInfos) == 0 {
		panic(fmt.Errorf("failed to find suitable replay info for height %d", chunkedHeight))
	}

	// replay
	for _, replayInfo := range runReplayInfos {
		logger.Info("using replay info", zap.String("ws", replayInfo.WebsocketEndpoint), zap.Int64("start", replayInfo.StartHeight), zap.Int64("end", replayInfo.FinalHeight))

		client, err := tmws.NewClient(replayInfo.WebsocketEndpoint)
		if err != nil {
			panic(errors.Wrap(err, "failed to create tendermint websocket client"))
		}

		for {
			strategy := "chunk"
			var batchStart, batchEnd int64 // batchEnd is only used in chunk strategy
			tailStartHash := lastProcessedHash
			txSeen := false
			chunkElems := int64(0)
			page := 1

			res, err := client.Status()
			if err != nil {
				panic(errors.Wrap(err, "failed to query status"))
			}
			lbh := res.SyncInfo.LatestBlockHeight

			// Find batch end and strategy
			if replayInfo.FinalHeight == -1 {
				if chunkedHeight+*chunkSize > lbh-*tailSize {
					strategy = "tail"
				}

				if strategy == "tail" {
					batchStart = lastProcessedHeight
				} else { // chunk strategy
					batchStart = chunkedHeight
					batchEnd = batchStart + *chunkSize
				}
			} else {
				batchStart = chunkedHeight
				if batchStart > replayInfo.FinalHeight {
					break
				}
				batchEnd = int64Min(batchStart+*chunkSize, replayInfo.FinalHeight+1)
			}

			if strategy == "tail" {
				logger.Info(fmt.Sprintf("indexing [%d, ∞]", batchStart), zap.String("strategy", strategy), zap.String("lptxh", lastProcessedHash))
			} else { // chunk strategy
				logger.Info(fmt.Sprintf("indexing [%d, %d]", batchStart, batchEnd-1), zap.String("strategy", strategy))
			}

			if err := db.Transaction(func(dbtx *gorm.DB) error {
				handler, err := indexerhandler.NewHandler(dbtx, indexerhandler.Config{
					MinterCodeIDs:    mcis,
					TendermintClient: client,
					BlockTimeCache:   blockTimeCache,
					PricesClient:     ps,
					Network:          network,
					NetworkStore:     netstore,
					IndexerMode:      indexerMode,
				}, logger)
				if err != nil {
					return errors.Wrap(err, "failed to create handler")
				}

				for {
					req := fmt.Sprintf("message.module = 'wasm' AND tx.height >= %d", batchStart)
					if strategy == "chunk" {
						req += fmt.Sprintf(" AND tx.height < %d", batchEnd)
					}
					res, err := client.TxSearch(
						req,
						false,
						&page,
						txsBatchSize,
						"asc",
					)
					if err != nil {
						return errors.Wrap(err, "failed to search txs")
					}

					for _, tx := range res.Txs {
						if strategy == "tail" {
							if lastProcessedHash != "" {
								if tx.Hash.String() == tailStartHash {
									txSeen = true
									continue
								}
								if !txSeen {
									continue
								}
							} else {
								txSeen = true
							}
						}

						tryPrintStats(lbh, tx.Height-1)

						if err := handler.HandleTendermintResultTx(tx); err != nil {
							return errors.Wrap(err, fmt.Sprintf(`failed to handle tx "%s"`, tx.Hash))
						}

						lastProcessedHeight = tx.Height
						lastProcessedHash = tx.Hash.String()
					}

					chunkElems += int64(len(res.Txs))
					if chunkElems >= int64(res.TotalCount) {
						break
					}

					page++
				}

				if strategy == "tail" {
					chunkedHeight = lastProcessedHeight + 1
				} else { // chunk strategy
					chunkedHeight = batchEnd
					tryPrintStats(lbh, chunkedHeight)
				}

				if err := dbtx.Model(&indexerdb.App{}).Where("id = ?", dbApp.ID).UpdateColumns(map[string]interface{}{
					"height":         lastProcessedHeight,
					"tx_hash":        lastProcessedHash,
					"chunked_height": chunkedHeight,
					"network_id":     networkID,
					"indexer_mode":   indexerMode,
				}).Error; err != nil {
					return errors.Wrap(err, "failed to update app height")
				}

				return nil
			}); err != nil {
				panic(errors.Wrap(err, "failed to commit chunk"))
			}

			if strategy == "tail" {
				time.Sleep(*pollDelay)
			}
		}
	}
}

func int64Min(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}
