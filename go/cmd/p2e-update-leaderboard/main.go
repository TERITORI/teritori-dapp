package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/TERITORI/teritori-dapp/go/internal/contractutil"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ConfigResponse struct {
	Owner        string `json:"owner"`
	Denom        string `json:"denom"`
	LastReportId int32  `json:"last_report_id"`
}

type Reward struct {
	Addr   string `json:"addr"`
	Amount string `json:"amount"`
}

type AddDailyReport struct {
	ReportId int32    `json:"report_id"`
	Rewards  []Reward `json:"rewards"`
}
type AddDailyReportQuery struct {
	AddDailyReport AddDailyReport `json:"add_daily_report"`
}

func sendRewardsList(distributorOwnerAddress string, distributorContractAddress string, distributorMnemonic string) {
	sender := distributorOwnerAddress
	contract := distributorContractAddress
	rpcEndpoint := "https://rpc.testnet.teritori.com:443"
	denom := "utori"
	amount := int64(1)
	chainId := "teritori-testnet-v3"
	keyName := "distributor-owner"
	mnemonic := "net nut power use vital render else amazing lizard lady ball parrot"
	fees := ""
	gasPrices := "0.025utori"
	gasAdjustment := 1.3
	funds := sdk.NewCoins(sdk.NewInt64Coin(denom, amount))
	memo := "Send from back"
	queryMsg := `{"config": {}}`

	data := contractutil.QueryWasm(sender, contract, queryMsg, chainId, rpcEndpoint)

	configResponse := ConfigResponse{}
	if err := json.Unmarshal([]byte(data), &configResponse); err != nil {
		panic(errors.Wrap(err, "fail to parse config response"))
	}
	lastReportId := configResponse.LastReportId

	execMsgRaw := AddDailyReportQuery{
		AddDailyReport: AddDailyReport{
			ReportId: lastReportId + 1,
			Rewards: []Reward{
				Reward{
					Addr:   "tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc",
					Amount: "1",
				},
			},
		},
	}

	execMsg, err := json.Marshal(execMsgRaw)
	if err != nil {
		panic(errors.Wrap(err, "fail to generate execMsg"))
	}
	execMsgStr := string(execMsg)

	contractutil.ExecuteWasm(
		sender,
		mnemonic,
		contract,
		execMsgStr,
		funds,
		chainId,
		rpcEndpoint,
		keyName,
		memo,
		fees,
		gasPrices,
		gasAdjustment,
	)
}

func updateLeaderboard(db *gorm.DB, logger *zap.Logger) {
	currentTimestamp := time.Now().Unix()

	// Update Rules:
	// - Only counting the stakings which have been started
	// - If staking is in progress => in progress duration = current - start_time
	// - If staking ends => if progress duration = end_time - start_time
	updateScoreErr := db.Exec(fmt.Sprint(`
		UPDATE p2e_leaderboards as lb
		SET 
			in_progress_score = score + LEAST(ss.end_time - ss.start_time, ? - ss.start_time)
		FROM p2e_squad_stakings as ss
		WHERE lb.user_id = ss.owner_id 
			AND lb.collection_id = ss.collection_id
			AND ss.start_time < ?
	`),
		currentTimestamp,
		currentTimestamp,
	).Error
	if updateScoreErr != nil {
		panic(errors.Wrap(updateScoreErr, "failed to update in progress score"))
	}
	logger.Info("Update leaderboard in_progress_score successfully")

	updateRankErr := db.Exec(fmt.Sprint(`
		UPDATE p2e_leaderboards as lb
		SET rank = orderedLb.rank
		FROM (SELECT user_id, collection_id, row_number() OVER (ORDER BY in_progress_score) AS rank FROM p2e_leaderboards) orderedLb
		WHERE lb.user_id = orderedLb.user_id
			AND lb.collection_id = orderedLb.collection_id
	`),
	).Error
	if updateRankErr != nil {
		panic(errors.Wrap(updateRankErr, "failed to update rank"))
	}
	logger.Info("Update leaderboard rank successfully")
}

func snapshotLeaderboard(db *gorm.DB, logger *zap.Logger) {
	snapshotErr := db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET snapshot_score = in_progress_score, snapshot_rank = rank
	`).Error

	if snapshotErr != nil {
		panic(errors.Wrap(snapshotErr, "failed to snapshot"))
	}
	logger.Info("Snapshot leaderboard successfully")
}

func runCmd(cmd string, message string, debug bool) {
	fmt.Println(">", message)
	out, err := exec.Command("bash", "-c", cmd).Output()

	if err != nil {
		panic(fmt.Sprintf("failed to run cmd: %s. Error: %s", cmd, err.Error()))
	}

	if debug {
		fmt.Println(string(out))
	}
	fmt.Println("OK")
}

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		distributorContractAddress = fs.String("teritori-distributor-contract-address", "", "distributor contract address")
		distributorOwnerAddress    = fs.String("teritori-distributor-owner-address", "", "owner that can send rewards list to distributor contract")
		distributorOwnerMnemonic   = fs.String("teritori-distributor-owner-mnemonic", "", "mnemonic of owner")

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

	schedule := gocron.NewScheduler(time.UTC)
	schedule.Every(1).Hour().Do(func() {
		updateLeaderboard(db, logger)
	})

	schedule.Every(1).Day().At("00:00").Do(func() {
		snapshotLeaderboard(db, logger)
		sendRewardsList(*distributorOwnerAddress, *distributorContractAddress, *distributorOwnerMnemonic)
	})

	schedule.StartBlocking()
}
