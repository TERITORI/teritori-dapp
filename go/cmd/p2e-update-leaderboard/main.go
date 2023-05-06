package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contractutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func cosmosSendRewardsList(
	netstore *networks.NetworkStore,
	network *networks.CosmosNetwork,
	seasonId string,
	leaderboard []indexerdb.P2eLeaderboard,
	rpcEndpoint string,
	distributorMnemonic string,
) (*sdk.TxResponse, error) {
	dailyRewards, err := p2e.GetDailyRewardsConfigBySeason(seasonId, network)

	if err != nil {
		return nil, errors.Wrap(err, "failed to get rewards")
	}

	contractQueryClient := contractutil.NewContractQueryClient(network.ChainID, rpcEndpoint)
	configData, err := contractQueryClient.QueryWasm(network.DistributorContractAddress, `{"config": {}}`)
	if err != nil {
		return nil, errors.Wrap(err, "failed to query contract")
	}

	mnemonic := distributorMnemonic
	funds := sdk.NewCoins()
	prefix := "tori"
	gasPrices := "0.025utori"
	gasAdjustment := 1.3

	distributorOwnerAddress := configData["owner"].(string)

	contractClient, err := contractutil.NewContractClient(
		network.ChainID,
		rpcEndpoint,
		prefix,
		distributorOwnerAddress,
		mnemonic,
		gasPrices,
		gasAdjustment,
	)

	if err != nil {
		return nil, errors.Wrap(err, "failed to get contract client")
	}

	rewardCoef := sdk.NewDec(1)
	// Adjust rewards in testnet
	if network.Testnet {
		rewardCoef = sdk.NewDecWithPrec(1, 6)
	}

	// Generate rewards list
	rewardsList := []map[string]interface{}{}

	for _, userScore := range leaderboard {
		_, addr, err := netstore.ParseUserID(string(userScore.UserID))
		if err != nil {
			return nil, errors.Wrap(err, "failed to parse user id")
		}

		rank := userScore.Rank

		if rank < 1 {
			return nil, errors.Wrap(err, "rank should not be < 1")
		}

		// Get daily reward by rank
		dailyReward := dailyRewards[rank-1]
		finalDailyAmount := dailyReward.Amount.Mul(rewardCoef)

		rewardsList = append(rewardsList, map[string]interface{}{"addr": addr, "amount": finalDailyAmount.RoundInt()})
	}

	execMsgRaw := map[string]interface{}{
		"add_daily_report": map[string]interface{}{
			"report_id": int32(configData["last_report_id"].(float64)) + 1,
			"rewards":   rewardsList,
		},
	}

	execMsg, err := json.Marshal(execMsgRaw)
	if err != nil {
		return nil, errors.Wrap(err, "fail to generate execMsg")
	}
	execMsgStr := string(execMsg)

	return contractClient.ExecuteWasm(network.DistributorContractAddress, execMsgStr, funds, "Send rewards list to top players")
}

func resetLeaderboard(seasonId string, networkId string, db *gorm.DB) error {
	err := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET
			score = 0,
			rank = 0,
			in_progress_score = 0,
			snapshot_rank = 0,
			snapshot_score = 0
		WHERE lb.season_id = ? AND network_id = ?
	`,
		seasonId, networkId,
	).Error
	if err != nil {
		return errors.Wrap(err, "failed to execute reset leaderboard query")
	}
	return nil
}

func updateLeaderboard(seasonId string, currentTime time.Time, networkId string, db *gorm.DB) error {
	now := currentTime
	currentTimestamp := now.Unix()
	dayBeginningTimestamp := time.Date(now.UTC().Year(), now.UTC().Month(), now.UTC().Day(), 0, 0, 0, 0, time.UTC).Unix()

	// S3 Rules:
	// - duration = (current/end - start/dayBegin)
	// - start is always < end and < current
	// - current is always >= dayBegin
	// All possibles cases:
	// - start     -> dayBegin  -> current   -> end         Duration: current - dayBegin > 0                     Tested
	// - start     -> dayBegin  -> end       -> current     Duration: end - dayBegin  > 0                        Tested
	// - start     -> end       -> dayBegin  -> current     Duration: end - dayBegin < 0 => duration = 0         Tested
	// - dayBegin  -> start     -> current   -> end         Duration: current - start > 0                        Tested
	// - dayBegin  -> start     -> end       -> current     Duration: end - start > 0                            Tested
	// Result: GREATEST (duration, 0)

	updateScoreErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET 
			in_progress_score = score + aggregated_ss.in_progress
		FROM (
			SELECT
				owner_id, 
				season_id, 
				SUM( GREATEST ( LEAST( ?, ss.end_time ) - GREATEST( ?, ss.start_time ) , 0 ) ) as in_progress
			FROM p2e_squad_stakings as ss
			WHERE network_id = ?
			GROUP BY owner_id, season_id
		) as aggregated_ss
		WHERE lb.user_id = aggregated_ss.owner_id
			AND lb.season_id = aggregated_ss.season_id
			AND lb.season_id = ?
			AND lb.network_id = ?
	`,
		currentTimestamp,
		dayBeginningTimestamp,
		networkId,
		seasonId,
		networkId,
	).Error
	if updateScoreErr != nil {
		return errors.Wrap(updateScoreErr, "failed to update in progress score")
	}

	updateRankErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET rank = orderedLb.rank
		FROM (
			SELECT 
				user_id, 
				ROW_NUMBER() OVER (ORDER BY in_progress_score DESC) AS rank 
			FROM p2e_leaderboards 
			WHERE season_id = ? AND network_id = ?
		) orderedLb
		WHERE lb.user_id = orderedLb.user_id
			AND lb.season_id = ? AND lb.network_id = ?
	`, seasonId, networkId, seasonId, networkId).Error
	if updateRankErr != nil {
		return errors.Wrap(updateRankErr, "failed to update rank")
	}
	return nil
}

func snapshotLeaderboard(seasonId string, networkId string, db *gorm.DB) error {
	snapshotErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET snapshot_score = in_progress_score, snapshot_rank = rank
		WHERE lb.season_id = ? AND lb.network_id = ?
	`, seasonId, networkId).Error

	if snapshotErr != nil {
		return errors.Wrap(snapshotErr, "failed to snapshot")
	}
	return nil
}

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		teritoriDistributorOwnerMnemonic = fs.String("teritori-distributor-owner-mnemonic", "", "mnemonic of the owner of distributor contract")
		ethereumDistributorOwnerMnemonic = fs.String("ethereum-distributor-owner-mnemonic", "", "mnemonic of the owner of distributor contract")
		networksFile                     = fs.String("networks-file", "networks.json", "path to networks config file")
		networkIds                       = fs.String("p2e-network-ids", "", "network ids")

		dbHost = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName = fs.String("database-name", "", "database name for postgreSQL")
		dbUser = fs.String("postgres-user", "", "username for postgreSQL")
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

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
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

	// get db
	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	// validate flags

	if *teritoriDistributorOwnerMnemonic == "" {
		panic(errors.New("distributor-owner-mnemonic is mandatory. You have to add TERITORI_DISTRIBUTOR_OWNER_MNEMONIC in .env for local testing (Don't commit this value on repo)"))
	}

	if *ethereumDistributorOwnerMnemonic == "" {
		panic(errors.New("distributor-owner-mnemonic is mandatory. You have to add ETHEREUM_DISTRIBUTOR_OWNER_MNEMONIC in .env for local testing (Don't commit this value on repo)"))
	}

	splittedNetworkIds := strings.Split(*networkIds, ",")
	for _, networkId := range splittedNetworkIds {
		network := netstore.MustGetNetwork(networkId)

		switch n := network.(type) {
		case *networks.CosmosNetwork:
			if n.DistributorContractAddress == "" {
				panic(errors.New("missing distributorContractAddress in network config"))
			}
			if n.ChainID == "" {
				panic(errors.New("missing chainId in network config"))
			}
			cosmosUpdateLeaderboard(n, logger, db, &netstore, *teritoriDistributorOwnerMnemonic)
			return
		case *networks.EthereumNetwork:
			ethereumUpdateLeaderboard(n, logger, db, &netstore, *ethereumDistributorOwnerMnemonic)
			return
		default:
			panic("unknown network")
		}
	}

}

func ethereumUpdateLeaderboard(
	network *networks.EthereumNetwork,
	logger *zap.Logger,
	db *gorm.DB,
	netstore *networks.NetworkStore,
	distributorOwnerMnemonic string,
) {
}

func cosmosUpdateLeaderboard(
	network *networks.CosmosNetwork,
	logger *zap.Logger,
	db *gorm.DB,
	netstore *networks.NetworkStore,
	distributorOwnerMnemonic string,
) {
	schedule := gocron.NewScheduler(time.UTC)
	schedule.Every(5).Minutes().Do(func() {
		currentTime := time.Now().UTC()
		season, _, err := p2e.GetSeasonByTime(currentTime, network)
		if err != nil {
			logger.Error("failed to get current season", zap.Error(err))
			return
		}

		if season.IsPre {
			logger.Info("do not need to update leaderboard", zap.String("season", season.ID))
			return
		}

		if err := db.Transaction(func(tx *gorm.DB) error {
			if err := updateLeaderboard(season.ID, currentTime, network.ID, tx); err != nil {
				return err
			}
			return nil
		}); err != nil {
			logger.Error(fmt.Sprintf("failed to update leaderboard for season: %s", season.ID), zap.Error(err))
		}

		logger.Info(fmt.Sprintf("update leaderboard successfully for season: %s", season.ID))
	})

	// Run a bit earlier than midnight to be sure that we snapshot on current season (if case of the season transition moment)
	schedule.Every(1).Day().At("00:00").Do(func() {
		// Subtract 2s to be sure we are in the expected day
		currentTime := time.Now().UTC().Add(-time.Second * 2) // 23h59m58s
		season, _, err := p2e.GetSeasonByTime(currentTime, network)
		if err != nil {
			logger.Error("failed to get current season", zap.Error(err))
			return
		}

		if season.IsPre {
			logger.Info("do not need to send rewards", zap.String("season", season.ID))
			return
		}

		var leaderboard []indexerdb.P2eLeaderboard

		if err := db.Transaction(func(tx *gorm.DB) error {
			// Update just before snapshot to have the latest info
			if err := updateLeaderboard(season.ID, currentTime, network.ID, tx); err != nil {
				return errors.Wrap(err, "failed to update leaderboard")
			}

			if err := snapshotLeaderboard(season.ID, network.ID, tx); err != nil {
				return errors.Wrap(err, "failed to snapshot leaderboard")
			}

			if err := tx.
				Where("season_id = ?", season.ID).
				Order("snapshot_rank asc").
				Limit(int(season.TopN)).
				Find(&leaderboard).
				Error; err != nil {
				return errors.Wrap(err, "failed to get current leaderboard")
			}

			return nil
		}); err != nil {
			logger.Error("failed to snapshot leaderboard", zap.Error(err))
			return
		}
		logger.Info(fmt.Sprintf("snapshot leaderboard successfully for season: %s", season.ID))

		txResponse, err := cosmosSendRewardsList(netstore, network, season.ID, leaderboard, network.RpcEndpoint, distributorOwnerMnemonic)
		if err != nil {
			logger.Error("failed to send rewards list", zap.Error(err))
			return
		}

		logger.Info(fmt.Sprintf("send daily rewards successfully for season: %s", season.ID), zap.String("TxHash", txResponse.TxHash))

		// Season 3: Reset leaderboard after rewards distribution
		if err := resetLeaderboard(season.ID, network.ID, db); err != nil {
			logger.Error("failed to reset leaderboard", zap.Error(err))
			return
		}
	})

	schedule.StartBlocking()
}
