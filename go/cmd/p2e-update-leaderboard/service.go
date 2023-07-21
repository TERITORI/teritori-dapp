package main

import (
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	hdwallet "github.com/miguelmota/go-ethereum-hdwallet"
	"github.com/mitchellh/mapstructure"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contractutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/go-co-op/gocron"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type LeaderboardService struct {
	networkId string
	netstore  *networks.NetworkStore
	db        *gorm.DB
	mnemonic  string
	logger    *zap.Logger
}

func NewLeaderboardService(
	networkId string,
	netstore *networks.NetworkStore,
	db *gorm.DB,
	mnemonic string,
	logger *zap.Logger,
) (*LeaderboardService, error) {
	return &LeaderboardService{
		networkId: networkId,
		netstore:  netstore,
		db:        db,
		mnemonic:  mnemonic,
		logger:    logger,
	}, nil
}

func (s *LeaderboardService) startScheduler() {
	network := s.netstore.MustGetNetwork(s.networkId)

	// TODO: Test if teritori works with rpcEndpoint from network config
	var rpcEndpoint string
	switch n := network.(type) {
	case *networks.CosmosNetwork:
		rpcEndpoint = n.RpcEndpoint
	case *networks.EthereumNetwork:
		rpcEndpoint = n.RpcEndpoint
	default:
		panic("unknown network")
	}

	schedule := gocron.NewScheduler(time.UTC)

	schedule.Every(5).Minutes().Do(func() {
		s.execUpdateLeaderboard(network, rpcEndpoint)
	})

	// schedule.Every(1).Day().At("00:00").Do(func() {
	schedule.Every(5).Seconds().Do(func() {
		s.execReportRewards(network, rpcEndpoint)
	})

	schedule.StartBlocking()
}

func (s *LeaderboardService) execReportRewards(network networks.Network, rpcEndpoint string) {
	// Run a bit earlier than midnight to be sure that we snapshot on current season (if case of the season transition moment)
	// Subtract 2s to be sure we are in the expected day
	currentTime := time.Now().UTC().Add(-time.Second * 2) // 23h59m58s
	season, _, err := p2e.GetSeasonByTime(currentTime, network)
	if err != nil {
		s.logger.Error("failed to get current season", zap.Error(err))
		return
	}

	if season.IsPre {
		s.logger.Info("do not need to send rewards", zap.String("season", season.ID))
		return
	}

	var leaderboard []indexerdb.P2eLeaderboard

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		// Update just before snapshot to have the latest info
		if err := s.updateLeaderboard(season.ID, currentTime, tx); err != nil {
			return errors.Wrap(err, "failed to update leaderboard")
		}

		if err := s.snapshotLeaderboard(season.ID, tx); err != nil {
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
		s.logger.Error("failed to snapshot leaderboard", zap.Error(err))
		return
	}
	s.logger.Info(fmt.Sprintf("snapshot leaderboard successfully for season: %s", season.ID))

	txHash, err := s.sendRewardsList(network, season.ID, leaderboard, rpcEndpoint)
	if err != nil {
		s.logger.Error("failed to send rewards list", zap.Error(err))
		return
	}

	s.logger.Info(fmt.Sprintf("send daily rewards successfully for season: %s", season.ID), zap.String("TxHash", txHash))

	// Season 3: Reset leaderboard after rewards distribution
	if err := s.resetLeaderboard(season.ID); err != nil {
		s.logger.Error("failed to reset leaderboard", zap.Error(err))
		return
	}
}

func (s *LeaderboardService) execUpdateLeaderboard(network networks.Network, rpcEndpoint string) {
	currentTime := time.Now().UTC()
	season, _, err := p2e.GetSeasonByTime(currentTime, network)
	if err != nil {
		s.logger.Error("failed to get current season", zap.Error(err))
		return
	}

	if season.IsPre {
		s.logger.Info("do not need to update leaderboard", zap.String("season", season.ID))
		return
	}

	if err := s.db.Transaction(func(tx *gorm.DB) error {
		if err := s.updateLeaderboard(season.ID, currentTime, tx); err != nil {
			return err
		}
		return nil
	}); err != nil {
		s.logger.Error(fmt.Sprintf("failed to update leaderboard for season: %s", season.ID), zap.Error(err))
	}

	s.logger.Info(fmt.Sprintf("update leaderboard successfully for season: %s", season.ID))
}

func (s *LeaderboardService) sendRewardsList(
	network networks.Network,
	seasonId string,
	leaderboard []indexerdb.P2eLeaderboard,
	rpcEndpoint string,
) (string, error) {
	switch n := network.(type) {
	case *networks.CosmosNetwork:
		return s.teritoriSendRewardsList(n, seasonId, leaderboard, rpcEndpoint)
	case *networks.EthereumNetwork:
		return s.ethereumSendRewardsList(n, seasonId, leaderboard, rpcEndpoint)
	default:
		panic("unknown network")
	}
}

func (s *LeaderboardService) ethereumSendRewardsList(
	network *networks.EthereumNetwork,
	seasonId string,
	leaderboard []indexerdb.P2eLeaderboard,
	rpcEndpoint string,
) (string, error) {
	const TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"

	dailyRewards, err := p2e.GetDailyRewardsConfigBySeason(seasonId, network)
	if err != nil {
		return "", errors.Wrap(err, "failed to get rewards")
	}

	// This data is compatible with DB
	todayDailyRewards := indexerdb.ObjectJSONB{} // addr => {token, amount}

	// Save rewards list
	todayRewards := p2e.UserRewardMap{}
	for _, userScore := range leaderboard {
		_, addr, err := s.netstore.ParseUserID(string(userScore.UserID))

		if err != nil {
			return "", errors.Wrap(err, "failed to parse user id")
		}

		rank := userScore.Rank

		if rank < 1 {
			return "", errors.Wrap(err, "rank should not be < 1")
		}

		// Get daily reward by rank
		dailyReward := dailyRewards[rank-1]
		amount := strings.Split(dailyReward.String(), ".")[0]
		todayRewards[addr] = p2e.UserReward{
			Token:  TOKEN_ADDRESS,
			Amount: amount,
		}

		todayDailyRewards[addr] = map[string]interface{}{
			"token":  TOKEN_ADDRESS,
			"amount": amount,
		}
	}

	now := time.Now().UTC()
	todayID := now.Format("2006-01-02")

	yesterdayID := now.AddDate(0, 0, -1).Format("2006-01-02")
	yesterdayData := indexerdb.P2eDailyReward{DayID: yesterdayID, NetworkID: s.networkId}
	if err := s.db.First(&yesterdayData).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.Wrap(err, "failed to save daily rewards")
		}
	}

	yesterdayTotalRewards := p2e.UserRewardMap{}

	// If yesterday data is not empty then try to decode it to map
	if yesterdayData.MerkleRoot != "" {
		if err := mapstructure.Decode(yesterdayData.TotalRewards, &yesterdayTotalRewards); err != nil {
			return "", errors.Wrap(err, "failed to decode yesterday reward to struct")
		}
	}

	// Calculate aggregated rewards = last aggregated rewards + today rewards
	for addr, reward := range todayRewards {
		yesterdayAmountStr := "0"
		if yesterdayTotalRewards[addr].Amount != "" {
			yesterdayAmountStr = yesterdayTotalRewards[addr].Amount
		}

		yesterdayAmount, err := sdk.NewDecFromStr(yesterdayAmountStr)
		if err != nil {
			return "", errors.Wrap(err, "failed to create dec from current reward amount")
		}

		todayAmount, err := sdk.NewDecFromStr(reward.Amount)
		if err != nil {
			return "", errors.Wrap(err, "failed to create dec from daily reward amount")
		}

		newAmount := yesterdayAmount.Add(todayAmount)
		reward.Amount = strings.Split(newAmount.String(), ".")[0]

		yesterdayTotalRewards[addr] = p2e.UserReward{
			Token:  reward.Token,
			Amount: reward.Amount,
		}
	}

	todayTotalRewards := indexerdb.ObjectJSONB{} // addr => {token, amount}
	if err := mapstructure.Decode(yesterdayTotalRewards, &todayTotalRewards); err != nil {
		return "", errors.Wrap(err, "failed to decode yesterday reward")
	}

	// Create merkle root
	leaves := make([]merkletree.Content, len(todayTotalRewards))
	i := 0
	for addr, data := range todayTotalRewards {
		var userReward p2e.UserReward
		if err := mapstructure.Decode(data, &userReward); err != nil {
			return "", errors.Wrap(err, "failed to decode user reward")
		}

		amount := new(big.Int)
		// userReward.Amount is already BigInt string so base here is 0
		amount, ok := amount.SetString(userReward.Amount, 0)
		if !ok {
			return "", errors.New("failed to create BigInt from user reward amount")
		}

		leaves[i] = p2e.RewardData{
			To:     common.HexToAddress(addr),
			Token:  common.HexToAddress(userReward.Token),
			Amount: amount,
		}
		i++
	}

	tree, err := merkletree.New(leaves)
	if err != nil {
		return "", errors.Wrap(err, "failed to created merkle tree")
	}

	// Save to DB to reuse the tree data to ensure that they are the same when verifying proof
	rewards := indexerdb.P2eDailyReward{
		DayID:        todayID,
		NetworkID:    s.networkId,
		DailyRewards: todayDailyRewards,
		TotalRewards: todayTotalRewards,
		MerkleRoot:   tree.GetHexRoot(),
	}
	if err := s.db.Create(&rewards).Error; err != nil {
		return "", errors.Wrap(err, "failed to save daily rewards")
	}
	s.logger.Info("saved daily rewards", zap.String("dayID", todayID), zap.String("networkID", s.networkId))

	s.logger.Info("sending update merkle tree tx...")
	tx, err := s.ethUpdateMerkleRoot(tree.GetHexRoot())
	if err != nil {
		return "", errors.Wrap(err, "failed to ethUpdateMerkleRoot")
	}

	return tx, nil
}

func (s *LeaderboardService) ethUpdateMerkleRoot(merkleRoot string) (string, error) {
	mnemonic := s.mnemonic
	wallet, err := hdwallet.NewFromMnemonic(mnemonic)
	if err != nil {
		return "", errors.Wrap(err, "failed to get wallet from given mnemonic")
	}

	path := hdwallet.MustParseDerivationPath("m/44'/60'/0'/0/0")
	account, err := wallet.Derive(path, false)
	if err != nil {
		return "", errors.Wrap(err, "failed to get account from wallet")
	}

	privateKey, err := wallet.PrivateKey(account)
	if err != nil {
		return "", errors.Wrap(err, "failed to get privateKey from account")
	}

	// ===================================================================================
	network := s.netstore.MustGetEthereumNetwork(s.networkId)
	client, err := ethclient.Dial(network.Endpoint)
	if err != nil {
		return "", errors.Wrap(err, "failed to connect to blockchain endpoint")
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return "", errors.Wrap(err, "failed to cast public key to ECDSA")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return "", errors.Wrap(err, "failed to get nonce")
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		return "", errors.Wrap(err, "failed to get suggest price")
	}

	auth := bind.NewKeyedTransactor(privateKey)
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)      // in wei
	auth.GasLimit = uint64(500_000) // in units
	auth.GasPrice = gasPrice

	address := common.HexToAddress(network.DistributorContractAddress)
	instance, err := abiGo.NewDistributor(address, client)
	if err != nil {
		return "", errors.Wrap(err, "failed to get nonce")
	}

	merkleRootBytes := [32]byte{}
	copy(merkleRootBytes[:], []byte(merkleRoot))

	tx, err := instance.UpdateMerkleRoot(auth, merkleRootBytes)
	if err != nil {
		return "", errors.Wrap(err, "failed to update merkle root")
	}

	txHash := tx.Hash().Hex()

	receipt, err := bind.WaitMined(context.Background(), client, tx)
	if err != nil {
		return "", errors.Wrap(err, "failed to mint tx on blockchain")
	}

	if receipt.Status == 0 {
		return "", errors.New("tx failed")
	}

	return txHash, nil
}

func (s *LeaderboardService) teritoriSendRewardsList(
	network *networks.CosmosNetwork,
	seasonId string,
	leaderboard []indexerdb.P2eLeaderboard,
	rpcEndpoint string,
) (string, error) {
	netstore := s.netstore
	distributorMnemonic := s.mnemonic

	dailyRewards, err := p2e.GetDailyRewardsConfigBySeason(seasonId, network)

	if err != nil {
		return "", errors.Wrap(err, "failed to get rewards")
	}

	contractQueryClient := contractutil.NewContractQueryClient(network.ChainID, rpcEndpoint)
	configData, err := contractQueryClient.QueryWasm(network.DistributorContractAddress, `{"config": {}}`)
	if err != nil {
		return "", errors.Wrap(err, "failed to query contract")
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
		return "", errors.Wrap(err, "failed to get contract client")
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
			return "", errors.Wrap(err, "failed to parse user id")
		}

		rank := userScore.Rank

		if rank < 1 {
			return "", errors.Wrap(err, "rank should not be < 1")
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
		return "", errors.Wrap(err, "fail to generate execMsg")
	}
	execMsgStr := string(execMsg)

	txRes, err := contractClient.ExecuteWasm(network.DistributorContractAddress, execMsgStr, funds, "Send rewards list to top players")
	return txRes.TxHash, err
}

func (s *LeaderboardService) resetLeaderboard(seasonId string) error {
	err := s.db.Exec(`
		UPDATE p2e_leaderboards as lb
		SET
			score = 0,
			rank = 0,
			in_progress_score = 0,
			snapshot_rank = 0,
			snapshot_score = 0
		WHERE lb.season_id = ? AND network_id = ?
	`,
		seasonId, s.networkId,
	).Error
	if err != nil {
		return errors.Wrap(err, "failed to execute reset leaderboard query")
	}
	return nil
}

func (s *LeaderboardService) updateLeaderboard(seasonId string, currentTime time.Time, tx *gorm.DB) error {
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

	updateScoreErr := tx.Exec(`
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
		s.networkId,
		seasonId,
		s.networkId,
	).Error
	if updateScoreErr != nil {
		return errors.Wrap(updateScoreErr, "failed to update in progress score")
	}

	updateRankErr := tx.Exec(`
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
	`, seasonId, s.networkId, seasonId, s.networkId).Error
	if updateRankErr != nil {
		return errors.Wrap(updateRankErr, "failed to update rank")
	}
	return nil
}

func (s *LeaderboardService) snapshotLeaderboard(seasonId string, tx *gorm.DB) error {
	snapshotErr := tx.Exec(`
		UPDATE p2e_leaderboards as lb
		SET snapshot_score = in_progress_score, snapshot_rank = rank
		WHERE lb.season_id = ? AND lb.network_id = ?
	`, seasonId, s.networkId).Error

	if snapshotErr != nil {
		return errors.Wrap(snapshotErr, "failed to snapshot")
	}
	return nil
}
