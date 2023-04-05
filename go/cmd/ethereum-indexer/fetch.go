package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/pkg/errors"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/db"
	"github.com/go-co-op/gocron"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	. "github.com/streamingfast/cli"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

const FETCH_FREQUENCY = 3 // 2 seconds
const FETCH_TIMEOUT = 5   // 2 seconds

var SinkFetchCmd = Command(SinkFetchE,
	"fetch <network>",
	"Fetch off-chain data from remote URI and feed the indexer DB",
	RangeArgs(1, 1),
	Flags(func(flags *pflag.FlagSet) {
		flags.String("indexer-database", "", "Indexer database DNS")
	}),
)

func getJsonFromURI(uri string, remainingRetries uint) (uint, map[string]interface{}, error) {
	httpClient := http.Client{
		Timeout: time.Second * FETCH_TIMEOUT, // Timeout after n seconds
	}

	res, err := httpClient.Get(uri)
	if err != nil {
		if remainingRetries == 0 {
			return remainingRetries, nil, fmt.Errorf("failed to query: %w", err)
		}

		zlog.Info("retries", zap.Uint("remainingRetries", remainingRetries), zap.String("uri", uri))
		return getJsonFromURI(uri, remainingRetries-1)
	}

	responseData, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return remainingRetries, nil, fmt.Errorf("failed to response: %W", err)
	}

	var dataJson map[string]interface{}
	if err := json.Unmarshal(responseData, &dataJson); err != nil {
		return remainingRetries, nil, fmt.Errorf("failed to unmarshal json: %W", err)
	}

	return remainingRetries, dataJson, nil
}

func processOffchainData(indexerDB *gorm.DB, network string) (int, error) {
	var rows []db.OffchainData

	// TODO: Check why using this does not work: &db.OffchainData{Network: "ethereum", IsFetched: false}
	if err := indexerDB.Where("network = 'ethereum' AND is_fetched = false").Find(&rows).Error; err != nil {
		return 0, fmt.Errorf("failed to query offchain_data for network %s: %w", network, err)
	}

	if len(rows) == 0 {
		return 0, nil
	}

	// If data is empty then try to get data from uri
	for idx, row := range rows {
		zlog.Info("processing offchain_data", zap.Int64("id", row.ID), zap.Bool("fetched", row.IsFetched))

		// Get map value
		mapValue, err := row.Data.Value()
		if err != nil {
			return idx, errors.Wrap(err, "failed to get map value")
		}

		if mapValue == "{}" {
			zlog.Info("fetching json data", zap.String("uri", row.URI))
			_, jsonData, err := getJsonFromURI(row.URI, 3)

			// If unable to fetch json then mark it to error then continue
			if err != nil {
				zlog.Info("unable to fetch json data, mark it to error", zap.Int64("id", row.ID))

				if err := indexerDB.Model(&row).Updates(db.OffchainData{IsFetched: true, Error: err.Error()}).Error; err != nil {
					return idx, errors.Wrap(err, "failed to mark error")
				}

				continue
			}

			row.Data = jsonData
			row.Error = ""
			indexerDB.Save(&row)
		}

		mapFields := strings.Split(row.FieldsMap, ",")
		var updates []string
		var values []any
		for _, mapField := range mapFields {
			s := strings.Split(mapField, ":")
			sourceField, targetField := s[0], s[1]

			sourceData := row.Data[sourceField]

			//  TODO: Should detect type dynamically
			if row.TableName == "nfts" && targetField == "attributes" {
				data, err := json.Marshal(row.Data[sourceField])
				if err != nil {
					return idx, errors.Wrap(err, "failed to marshal json")
				}
				sourceData = data
			}

			updates = append(updates, fmt.Sprintf("%s=?", targetField))
			values = append(values, sourceData)
		}

		zlog.Info("update data to target", zap.String("table", row.TableName), zap.String("pk", row.Pk))
		stmt := fmt.Sprintf("UPDATE %s SET %s WHERE id = '%s'", row.TableName, strings.Join(updates, ","), row.Pk)

		if err := indexerDB.Exec(stmt, values...).Error; err != nil {
			return idx, errors.Wrap(err, fmt.Sprintf("failed to update target %s", stmt))
		}

		row.IsFetched = true
		indexerDB.Save(&row)
	}

	return len(rows), nil
}

func SinkFetchE(cmd *cobra.Command, args []string) error {
	zlog.Info("fetching offchain data...")

	network := args[0]
	MustLoadEnv(network)

	database := MustGetFlagString("indexer-database")
	indexerDB := db.MustConnectIndexerDB(database)

	schedule := gocron.NewScheduler(time.UTC)
	isProcessing := false
	schedule.Every(FETCH_FREQUENCY).Seconds().Do(func() {
		if isProcessing {
			return
		}

		isProcessing = true
		processedCount, err := processOffchainData(indexerDB, network)
		if err != nil {
			zlog.Error("failed to process offchain data", zap.Int("processedCount", processedCount), zap.String("error", err.Error()))
		}
		isProcessing = false
	})

	schedule.StartBlocking()
	return nil
}
