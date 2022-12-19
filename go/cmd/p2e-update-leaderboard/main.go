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

type Obj = contractutil.Obj

func sendRewardsList(db *gorm.DB, riotStartedAt string, chainId string, rpcEndpoint string, distributorOwnerAddress string, distributorContractAddress string, distributorMnemonic string) (*sdk.TxResponse, error) {
	monthlyRewards, err := p2e.GetCurrentRewardsConfig(riotStartedAt)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get rewards")
	}

	sender := distributorOwnerAddress
	mnemonic := distributorMnemonic
	contract := distributorContractAddress
	funds := sdk.NewCoins()
	toriDenominator := 1_000_000

	if strings.HasPrefix(rpcEndpoint, "https") {
		rpcEndpoint += ":443"
	}

	contractClient := contractutil.ContractClient{
		ChainId:     chainId,
		RpcEndpoint: rpcEndpoint,
		// Only need for exec
		Bech32PrefixAccAddr: "tori",
		GasPrices:           "0.025utori",
		GasAdjustment:       1.3,
	}

	configData, err := contractClient.QueryWasm(contract, `{"config": {}}`)
	if err != nil {
		return nil, errors.Wrap(err, "failed to query contract")
	}

	// Get leaderboard
	rewardsList := []Obj{}

	var leaderboard []indexerdb.P2eLeaderboard
	if err := db.Limit(500).Find(&leaderboard).Error; err != nil {
		return nil, errors.Wrap(err, "failed to get current leaderboard")
	}

	rewardCoef := float64(1)
	// Adjust rewards in testnet
	if strings.HasPrefix(chainId, "teritori-testnet") {
		rewardCoef = 1 / float64(toriDenominator)
	}

	// Generate rewards list
	for _, userScore := range leaderboard {
		addr := strings.Split(string(userScore.UserID), "-")[1]
		rank := userScore.Rank

		toriAmount := int(rewardCoef * float64(toriDenominator) * monthlyRewards[rank-1] / 30) // Get daily reward
		rewardsList = append(rewardsList, Obj{"addr": addr, "amount": fmt.Sprintf("%d", toriAmount)})
	}

	execMsgRaw := Obj{
		"add_daily_report": Obj{
			"report_id": int32(configData["last_report_id"].(float64)) + 1,
			"rewards":   rewardsList,
		},
	}

	execMsg, err := json.Marshal(execMsgRaw)
	if err != nil {
		return nil, errors.Wrap(err, "fail to generate execMsg")
	}
	execMsgStr := string(execMsg)

	return contractClient.ExecuteWasm(sender, mnemonic, contract, execMsgStr, funds, "Send rewards list")
}

func updateLeaderboard(db *gorm.DB) error {
	currentTimestamp := time.Now().Unix()

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
			AND lb.collection_id = ss.collection_id
			AND ss.start_time < ?
	`,
		currentTimestamp,
		currentTimestamp,
	).Error
	if updateScoreErr != nil {
		return errors.Wrap(updateScoreErr, "failed to update in progress score")
	}

	updateRankErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET rank = orderedLb.rank
		FROM (SELECT user_id, collection_id, row_number() OVER (ORDER BY in_progress_score) AS rank FROM p2e_leaderboards) orderedLb
		WHERE lb.user_id = orderedLb.user_id
			AND lb.collection_id = orderedLb.collection_id
	`).Error
	if updateRankErr != nil {
		return errors.Wrap(updateRankErr, "failed to update rank")
	}
	return nil
}

func snapshotLeaderboard(db *gorm.DB) error {
	snapshotErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET snapshot_score = in_progress_score, snapshot_rank = rank
	`).Error

	if snapshotErr != nil {
		return errors.Wrap(snapshotErr, "failed to snapshot")
	}
	return nil
}

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		distributorContractAddress = fs.String("teritori-distributor-contract-address", "", "distributor contract address")
		distributorOwnerAddress    = fs.String("teritori-distributor-owner-address", "", "owner that can send rewards list to distributor contract")
		distributorOwnerMnemonic   = fs.String("teritori-distributor-owner-mnemonic", "", "mnemonic of owner")
		chainId                    = fs.String("public-chain-id", "", "public chain id")
		rpcEndpoint                = fs.String("public-chain-rpc-endpoint", "", "public chain rpc endpoint")
		riotStartedAt              = fs.String("the-riot-started-at", "", "time where the riot game starts")

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

	if chainId == nil {
		panic(errors.New("chainId is mandatory"))
	}

	if rpcEndpoint == nil {
		panic(errors.New("rpcEndpoint is mandatory"))
	}

	if riotStartedAt == nil {
		panic(errors.New("riotStartedAt is mandatory"))
	}

	schedule := gocron.NewScheduler(time.UTC)
	schedule.Every(1).Hour().Do(func() {
		if err := updateLeaderboard(db); err != nil {
			logger.Error("failed to update leaderboard", zap.Error(err))
			return
		}
		logger.Info("update leaderboard successfully")
	})

	schedule.Every(1).Day().At("00:00").Do(func() {
		if err := snapshotLeaderboard(db); err != nil {
			logger.Error("failed to snapshot leaderboard", zap.Error(err))
			return
		}
		logger.Info("snapshot leaderboard successfully")

		txResponse, err := sendRewardsList(db, *riotStartedAt, *chainId, *rpcEndpoint, *distributorOwnerAddress, *distributorContractAddress, *distributorOwnerMnemonic)
		if err != nil {
			logger.Error("failed to send rewards list", zap.Error(err))
			return
		}

		logger.Info("send rewards list successfully", zap.String("TxHash", txResponse.TxHash))
	})

	schedule.StartBlocking()
}
