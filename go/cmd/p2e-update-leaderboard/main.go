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
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

func sendRewardsList(seasonId string, db *gorm.DB, chainId string, rpcEndpoint string, distributorContractAddress string, distributorMnemonic string) (*sdk.TxResponse, error) {
	dailyRewards, err := p2e.GetDailyRewardsConfigBySeason(seasonId)

	if err != nil {
		return nil, errors.Wrap(err, "failed to get rewards")
	}

	contractQueryClient := contractutil.NewContractQueryClient(chainId, rpcEndpoint)
	configData, err := contractQueryClient.QueryWasm(distributorContractAddress, `{"config": {}}`)
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
		chainId,
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

	// Get leaderboard
	season, err := p2e.GetSeasonById(seasonId)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get season data")
	}

	var leaderboard []indexerdb.P2eLeaderboard
	if err := db.
		Where("season_id = ?", seasonId).
		Order("snapshot_rank asc").
		Limit(int(season.TopN)).
		Find(&leaderboard).
		Error; err != nil {
		return nil, errors.Wrap(err, "failed to get current leaderboard")
	}

	rewardCoef := sdk.NewDec(1)
	// Adjust rewards in testnet
	if strings.HasPrefix(chainId, "teritori-testnet") {
		rewardCoef = sdk.NewDecWithPrec(1, 6)
	}

	// Generate rewards list
	rewardsList := []map[string]interface{}{}

	for _, userScore := range leaderboard {
		addr := strings.Split(string(userScore.UserID), "-")[1]
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

	return contractClient.ExecuteWasm(distributorContractAddress, execMsgStr, funds, "Send rewards list to top players")
}

func updateLeaderboard(seasonId string, db *gorm.DB) error {
	currentTimestamp := time.Now().UTC().Unix()

	// Update Rules:
	// - Only counting the stakings which have been started
	// - If staking is in progress => in progress duration = current - start_time
	// - If staking ends => if progress duration = end_time - start_time
	updateScoreErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET 
			in_progress_score = score + LEAST(ss.end_time - ss.start_time, ? - ss.start_time)
		FROM p2e_squad_stakings as ss
		WHERE lb.user_id = ss.owner_id 
			AND lb.season_id = ?
			AND ss.start_time < ?
	`,
		currentTimestamp,
		seasonId,
		currentTimestamp,
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
			WHERE season_id = ?
		) orderedLb
		WHERE lb.user_id = orderedLb.user_id
			AND lb.season_id = ?
	`, seasonId, seasonId).Error
	if updateRankErr != nil {
		return errors.Wrap(updateRankErr, "failed to update rank")
	}
	return nil
}

func snapshotLeaderboard(seasonId string, db *gorm.DB) error {
	snapshotErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET snapshot_score = in_progress_score, snapshot_rank = rank
		WHERE lb.season_id = ?
	`, seasonId).Error

	if snapshotErr != nil {
		return errors.Wrap(snapshotErr, "failed to snapshot")
	}
	return nil
}

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		distributorContractAddress = fs.String("teritori-distributor-contract-address", "", "distributor contract address")
		distributorOwnerMnemonic   = fs.String("teritori-distributor-owner-mnemonic", "", "mnemonic of the owner of distributor contract")
		chainId                    = fs.String("public-chain-id", "", "public chain id")
		rpcEndpoint                = fs.String("public-chain-rpc-endpoint", "", "public chain rpc endpoint")
		theRiotGameStartedAt       = fs.String("the-riot-game-started-at", "", "time where the riot game starts")

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

	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	if *chainId == "" {
		panic(errors.New("chain-id is mandatory"))
	}

	if *rpcEndpoint == "" {
		panic(errors.New("rpc-endpoint is mandatory"))
	}

	if *theRiotGameStartedAt == "" {
		panic(errors.New("the-riot-game-started-at is mandatory"))
	}

	if *distributorContractAddress == "" {
		panic(errors.New("distributor-contract-address is mandatory"))
	}

	if *distributorOwnerMnemonic == "" {
		panic(errors.New("distributor-owner-mnemonic is mandatory. You have to add it in .env for local testing (Don't commit this value on repo)"))
	}

	schedule := gocron.NewScheduler(time.UTC)
	schedule.Every(1).Hour().Do(func() {
		season, _, err := p2e.GetSeasonByTime(*theRiotGameStartedAt, time.Now().UTC())
		if err != nil {
			logger.Error("failed to get current season", zap.Error(err))
			return
		}

		if err := updateLeaderboard(season.ID, db); err != nil {
			logger.Error(fmt.Sprintf("failed to update leaderboard for season: %s", season.ID), zap.Error(err))
			return
		}
		logger.Info(fmt.Sprintf("update leaderboard successfully for season: %s", season.ID))
	})

	// Run a bit earlier than midnight to be sure that we snapshot on current season (if case of the season transition moment)
	schedule.Every(1).Day().At("23:59").Do(func() {
		season, _, err := p2e.GetCurrentSeason(*theRiotGameStartedAt)
		if err != nil {
			logger.Error("failed to get current season", zap.Error(err))
			return
		}

		// Update just before snapshot to have the latest info
		if err := updateLeaderboard(season.ID, db); err != nil {
			logger.Error(fmt.Sprintf("failed to update leaderboard for season: %s", season.ID), zap.Error(err))
			return
		}
		logger.Info(fmt.Sprintf("update leaderboard before snapshot successfully for season: %s", season.ID))

		if err := snapshotLeaderboard(season.ID, db); err != nil {
			logger.Error("failed to snapshot leaderboard", zap.Error(err))
			return
		}
		logger.Info(fmt.Sprintf("snapshot leaderboard successfully for season: %s", season.ID))

		txResponse, err := sendRewardsList(season.ID, db, *chainId, *rpcEndpoint, *distributorContractAddress, *distributorOwnerMnemonic)
		if err != nil {
			logger.Error("failed to send rewards list", zap.Error(err))
			return
		}

		logger.Info(fmt.Sprintf("send daily rewards successfully for season: %s", season.ID), zap.String("TxHash", txResponse.TxHash))
	})

	schedule.StartBlocking()
}
