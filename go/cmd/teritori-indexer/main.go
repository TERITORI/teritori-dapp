package main

import (
	"flag"
	"fmt"
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
		chunkSize                      = fs.Int64("chunk-size", 10000, "maximum number of blocks to query from tendermint at once")
		txsBatchSize                   = fs.Int("txs-batch-size", 10000, "maximum number of txs per query page")
		pollDelay                      = fs.Duration("poll-delay", 2*time.Second, "delay between tail queries")
		tnsContractAddress             = fs.String("teritori-name-service-contract-address", "", "address of the teritori name service contract")
		vaultContractAddress           = fs.String("teritori-vault-contract-address", "", "address of the teritori vault contract")
		squadStakingContactAddressV1   = fs.String("the-riot-squad-staking-contract-address-v1", "", "address of the teritori squad staking contract V1")
		squadStakingContactAddressV2   = fs.String("the-riot-squad-staking-contract-address-v2", "", "address of the teritori squad staking contract V2")
		theRiotBreedingContractAddress = fs.String("the-riot-breeding-contract-address", "", "address of the breeding contract")
		minterCodeIDs                  = fs.String("teritori-minter-code-ids", "", "code ids of teritori minter contracts")
		tnsDefaultImageURL             = fs.String("teritori-name-service-default-image-url", "", "url of a fallback image for TNS")
		dbHost                         = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort                         = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass                         = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName                         = fs.String("database-name", "", "database name for postgreSQL")
		dbUser                         = fs.String("postgres-user", "", "username for postgreSQL")
		tendermintWebsocketEndpoint    = fs.String("tendermint-websocket-endpoint", "", "tendermint websocket endpoint")
		tailSize                       = fs.Int64("tail-size", 8640, "x blocks tail size means that the tendermint indexer can lag x blocks behind before the indexer misses an event")
		pricesServiceURI               = fs.String("prices-service-uri", "localhost:9091", "price service URI")
		insecurePrices                 = fs.Bool("prices-insecure-grpc", false, "do not use TLS to connect to prices service")
		sellerConractAddress           = fs.String("teritori-freelance-seller-address", "", "address of the teritori freelance seller contract")
		escrowContractAddress          = fs.String("teritori-freelance-escrow-address", "", "address of the teritori freelance escrow contract")
		reportContractAddress          = fs.String("teritori-freelance-report-address", "", "address of the teritori freelance repoprt contract")
		networksFile                   = fs.String("networks-file", "networks.json", "path to networks config file")
		networkID                      = fs.String("indexer-network-id", "teritori", "network id to index")
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

	if *tnsContractAddress == "" {
		panic(errors.New("missing teritori-name-service-contract-address flag"))
	}
	if *sellerConractAddress == "" {
		panic(errors.New("missing teritori-seller-contract-address flag"))
	}
	if *escrowContractAddress == "" {
		panic(errors.New("missing teritori-freelance-escrow-address flag"))
	}
	if *reportContractAddress == "" {
		panic(errors.New("missing teritori-freelance-report-address flag"))
	}
	if *tendermintWebsocketEndpoint == "" {
		panic(errors.New("missing tendermint-websocket-endpoint flag"))
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
	var dbApp indexerdb.App
	if err := db.FirstOrCreate(&dbApp).Error; err != nil {
		panic(errors.Wrap(err, "failed to get db app"))
	}
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
			ID:    q.ID,
			Title: q.Title,
		})
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

			// Find batch end and strategy
			if replayInfo.FinalHeight == -1 {
				res, err := client.Status()
				if err != nil {
					panic(errors.Wrap(err, "failed to query status"))
				}

				lbh := res.SyncInfo.LatestBlockHeight

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
				logger.Info(fmt.Sprintf("indexing [%d, 8]", batchStart), zap.String("strategy", strategy), zap.String("lptxh", lastProcessedHash))
			} else { // chunk strategy
				logger.Info(fmt.Sprintf("indexing [%d, %d]", batchStart, batchEnd-1), zap.String("strategy", strategy))
			}

			if err := db.Transaction(func(dbtx *gorm.DB) error {
				handler, err := indexerhandler.NewHandler(dbtx, indexerhandler.Config{
					MinterCodeIDs:                  mcis,
					VaultContractAddress:           *vaultContractAddress,
					SquadStakingContractAddressV1:  *squadStakingContactAddressV1,
					SquadStakingContractAddressV2:  *squadStakingContactAddressV2,
					TheRiotBreedingContractAddress: *theRiotBreedingContractAddress,
					TNSContractAddress:             *tnsContractAddress,
					SellerContractAddress:          *sellerConractAddress,
					EscrowContractAddress:          *escrowContractAddress,
					ReportContractAddress:          *reportContractAddress,
					TNSDefaultImageURL:             *tnsDefaultImageURL,
					TendermintClient:               client,
					BlockTimeCache:                 blockTimeCache,
					PricesClient:                   ps,
					Network:          				network,
					NetworkStore:     				netstore,
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
				}

				if err := dbtx.Model(&indexerdb.App{}).Where("id = ?", dbApp.ID).UpdateColumns(map[string]interface{}{
					"height":         lastProcessedHeight,
					"tx_hash":        lastProcessedHash,
					"chunked_height": chunkedHeight,
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
