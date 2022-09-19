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

func main() {
	fs := flag.NewFlagSet("teritori-indexer", flag.ContinueOnError)
	var (
		tendermintRPCEndpoint = fs.String("tendermint-rpc-endpoint", "", "tendermint rpc endpoint of a teritori node")
		cosmosRESTEndpoint    = fs.String("cosmos-rest-endpoint", "", "rest endpoint of a teritori node")
		dbPath                = fs.String("db-path", "", "path to the database file")
		blocksBatchSize       = fs.Int64("blocks-batch-size", 100000, "maximum number of blocks to query from tendermint at once")
		txsBatchSize          = fs.Int("txs-batch-size", 100, "number of txs per query page")
		pollDelay             = fs.Duration("poll-delay", 2*time.Second, "delay between queries")
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

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	client, err := tclient.New(*tendermintRPCEndpoint, "")
	if err != nil {
		panic(errors.Wrap(err, "failed to create client"))
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

	for {
		res, err := client.Status(context.Background())
		if err != nil {
			panic(errors.Wrap(err, "failed to query status"))
		}
		if res.SyncInfo.LatestBlockHeight < height {
			time.Sleep(*pollDelay)
			continue
		}
		end := int64Min(height+*blocksBatchSize, res.SyncInfo.LatestBlockHeight+1)
		if height == end-1 {
			logger.Info(fmt.Sprintf("indexing %d", height))
		} else {
			logger.Info(fmt.Sprintf("indexing [%d, %d]", height, end-1))
		}

		if err := db.Transaction(func(dbtx *gorm.DB) error {
			handler, err := indexerhandler.NewHandler(dbtx, *cosmosRESTEndpoint, logger)
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
						return errors.Wrap(err, "failed to handle tx")
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

func int64Min(a, b int64) int64 {
	if a < b {
		return a
	}
	return b
}
