package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerhandler"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	tclient "github.com/tendermint/tendermint/rpc/client/http"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ReplayInfo struct {
	StartHeight  int64
	FinalHeight  int64
	RPCEndpoint  string
	RESTEndpoint string
}

func main() {
	fs := flag.NewFlagSet("teritori-indexer", flag.ContinueOnError)
	var (
		tendermintRPCEndpoint = fs.String("tendermint-rpc-endpoint", "", "tendermint rpc endpoint of a teritori node")
		cosmosRESTEndpoint    = fs.String("cosmos-rest-endpoint", "", "rest endpoint of a teritori node")
		dbPath                = fs.String("db-path", "", "path to the database file")
		blocksBatchSize       = fs.Int64("blocks-batch-size", 100000, "maximum number of blocks to query from tendermint at once")
		txsBatchSize          = fs.Int("txs-batch-size", 100, "number of txs per query page")
		pollDelay             = fs.Duration("poll-delay", 2*time.Second, "delay between queries")
		tnsContractAddress    = fs.String("teritori-name-service-contract-address", "", "address of the teritori name service contract")
		vaultContractAddress  = fs.String("teritori-vault-contract-address", "", "address of the teritori vault contract")
		minterCodeID          = fs.Uint64("teritori-minter-code-id", 0, "code id of the teritori minter contract")
		tnsDefaultImageURL    = fs.String("teritori-name-service-default-image-url", "", "url of a fallback image for TNS")
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

	if *tendermintRPCEndpoint == "" {
		panic(errors.New("missing tendermint-rpc-endpoint flag"))
	}
	if *cosmosRESTEndpoint == "" {
		panic(errors.New("missing cosmos-rest-endpoint flag"))
	}
	if *dbPath == "" {
		panic(errors.New("missing db-path flag"))
	}
	if *tnsContractAddress == "" {
		panic(errors.New("missing teritori-name-service-contract-address flag"))
	}
	if *minterCodeID == 0 {
		panic(errors.New("missing minter-code-id flag"))
	}

	replayInfos := []ReplayInfo{
		{
			StartHeight:  0,
			FinalHeight:  1154235,
			RPCEndpoint:  "https://teritorid.65.108.73.219.nip.io:443/rpc",
			RESTEndpoint: "https://teritorid.65.108.73.219.nip.io:443/rest",
		},
		{
			StartHeight:  1154236,
			FinalHeight:  -1,
			RPCEndpoint:  *tendermintRPCEndpoint,
			RESTEndpoint: *cosmosRESTEndpoint,
		},
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	db, err := indexerdb.NewSQLiteDB(*dbPath)
	if err != nil {
		panic(errors.Wrap(err, fmt.Sprintf(`failed to access db at "%s"`, *dbPath)))
	}

	var dbApp indexerdb.App
	if err := db.FirstOrCreate(&dbApp).Error; err != nil {
		panic(errors.Wrap(err, "failed to get db app"))
	}
	height := dbApp.Height

	var runReplayInfos []ReplayInfo
	for i, replayInfo := range replayInfos {
		if replayInfo.StartHeight <= height && (replayInfo.FinalHeight == -1 || replayInfo.FinalHeight >= height) {
			runReplayInfos = replayInfos[i:]
			break
		}
	}
	if len(runReplayInfos) == 0 {
		panic(fmt.Errorf("failed to find suitable replay info for height %d", height))
	}

	for _, replayInfo := range runReplayInfos {
		logger.Info("using replay info", zap.String("rpc", replayInfo.RPCEndpoint), zap.String("rest", replayInfo.RESTEndpoint), zap.Int64("start", replayInfo.StartHeight), zap.Int64("end", replayInfo.FinalHeight))
		client, err := tclient.New(replayInfo.RPCEndpoint, "")
		if err != nil {
			panic(errors.Wrap(err, "failed to create client"))
		}
		for {
			var end int64
			if replayInfo.FinalHeight == -1 {
				res, err := client.Status(context.Background())
				if err != nil {
					panic(errors.Wrap(err, "failed to query status"))
				}
				if res.SyncInfo.LatestBlockHeight < height {
					time.Sleep(*pollDelay)
					continue
				}
				end = int64Min(height+*blocksBatchSize, res.SyncInfo.LatestBlockHeight+1)
			} else {
				if height > replayInfo.FinalHeight {
					break
				}
				end = int64Min(height+*blocksBatchSize, replayInfo.FinalHeight+1)
			}
			if height == end-1 {
				logger.Info(fmt.Sprintf("indexing %d", height))
			} else {
				logger.Info(fmt.Sprintf("indexing [%d, %d]", height, end-1))
			}

			if err := db.Transaction(func(dbtx *gorm.DB) error {
				handler, err := indexerhandler.NewHandler(dbtx, indexerhandler.Config{
					MinterCodeID:         *minterCodeID,
					VaultContractAddress: *vaultContractAddress,
					RESTEndpoint:         replayInfo.RESTEndpoint,
					TNSContractAddress:   *tnsContractAddress,
					TNSDefaultImageURL:   *tnsDefaultImageURL,
				}, logger)
				if err != nil {
					return errors.Wrap(err, "failed to create handler")
				}

				chunkElems := int64(0)
				page := 1
				for {
					res, err := client.TxSearch(
						context.Background(),
						fmt.Sprintf("message.module = 'wasm' AND tx.height >= %d AND tx.height < %d", height, end),
						true,
						&page,
						txsBatchSize,
						"asc",
					)
					if err != nil {
						return errors.Wrap(err, "failed to search txs")
					}

					for _, tx := range res.Txs {
						if err := handler.HandleTendermintResultTx(tx); err != nil {
							return errors.Wrap(err, fmt.Sprintf(`failed to handle tx "%s"`, tx.Hash))
						}
					}

					chunkElems += int64(len(res.Txs))
					if chunkElems >= int64(res.TotalCount) {
						break
					}

					page++
				}

				if err := dbtx.Model(&indexerdb.App{}).Where("id = ?", dbApp.ID).Update("height", end).Error; err != nil {
					return errors.Wrap(err, "failed to update app height")
				}

				return nil
			}); err != nil {
				panic(errors.Wrap(err, "failed to commit chunk"))
			}
			height = end
		}
	}
}

func int64Min(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}
