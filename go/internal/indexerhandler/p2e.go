package indexerhandler

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contracts/breeding_minter_types"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Nft struct {
	ContractAddr string `json:"contract_addr"`
	TokenId      string `json:"token_id"`
}

type SquadStakeMsg struct {
	Nfts []Nft `json:"nfts"`
}

type ExecuteSquadStakeMsg struct {
	Stake SquadStakeMsg `json:"stake"`
}

func (h *Handler) handleInstantiateBreeding(e *Message, contractAddress string, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	// get nft contract address
	nftAddrs := e.Events["wasm.nft_addr"]
	if len(nftAddrs) == 0 {
		return errors.New("no nft contract address")
	}
	nftAddr := nftAddrs[0]

	var minterInstantiateMsg breeding_minter_types.InstantiateMsg
	if err := json.Unmarshal(instantiateMsg.Msg.Bytes(), &minterInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal breeding minter instantiate msg")
	}

	// FIXME: network queries should be done async

	// try to fetch collection metadata
	metadataURI := minterInstantiateMsg.ChildNftBaseUri
	var metadata CollectionMetadata
	if err := fetchIPFSJSON(metadataURI, &metadata); err != nil {
		h.logger.Error("failed to fetch collection metadata", zap.String("metadata-uri", metadataURI), zap.Error(err))
	}

	maxSupply := minterInstantiateMsg.ChildNftMaxSupply

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create collection
	collectionId := h.config.Network.CollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:                  collectionId,
		NetworkId:           h.config.Network.ID,
		Name:                minterInstantiateMsg.ChildNftName,
		ImageURI:            metadata.ImageURI,
		MaxSupply:           maxSupply,
		SecondaryDuringMint: true,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  nftAddr,
			CreatorAddress:      instantiateMsg.Sender,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", string(collectionId)))

	return nil
}

// Insert a new P2eSquadStaking record when staking begins
func (h *Handler) handleExecuteSquadStake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var squadStakeMsg ExecuteSquadStakeMsg
	if err := json.Unmarshal(execMsg.Msg, &squadStakeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal squadStake execute msg")
	}

	users := e.Events["wasm.p2e_user"]
	if len(users) == 0 {
		return errors.New("no user")
	}

	startTimes := e.Events["wasm.p2e_start_time"]
	if len(startTimes) == 0 {
		return errors.New("no start_time")
	}

	endTimes := e.Events["wasm.p2e_end_time"]
	if len(endTimes) == 0 {
		return errors.New("no end_time")
	}

	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token_id")
	}

	ownerId := h.config.Network.UserID(users[0])

	startTime, err := strconv.ParseUint(startTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse start_time")
	}

	startTimeDt := time.Unix(int64(startTime), 0)
	season, _, err := p2e.GetSeasonByTime(startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	if execMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV1 && season.ID != "Season 1" {
		h.logger.Info("ignored p2e stake event for V1 contract out of Season 1")
		return nil
	}

	endTime, err := strconv.ParseUint(endTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse end_time")
	}

	var count int64
	if err := h.db.Model(&indexerdb.P2eSquadStaking{}).
		Where("owner_id  = ? AND start_time = ?", ownerId, startTime).
		Count(&count).Error; err != nil {
		return errors.Wrap(err, "failed to query current staking")
	}

	if count != 0 {
		return errors.New("data corrupts: we should not have a current staking")
	}

	squadStaking := indexerdb.P2eSquadStaking{
		OwnerID:   ownerId,
		StartTime: startTime,
		EndTime:   endTime,
		TokenIDs:  strings.Join(tokenIds, ","),
		SeasonID:  season.ID,
	}

	if err := h.db.Create(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	// Create leaderboard (by season) record if does not exist
	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:   ownerId,
		SeasonID: season.ID,
	}
	if err := h.db.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get/create user record for leaderboard")
	}

	contractVersion := "V2"
	if execMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV1 {
		contractVersion = "V1"
	}
	h.logger.Info("created leaderboard entry", zap.String("contract-version", contractVersion), zap.String("user-id", string(ownerId)), zap.String("season-id", season.ID))

	// Update lockedOn: set lockedOn = contract which holds NFTs
	lockedOn := h.config.Network.UserID(execMsg.Contract)

	for _, nft := range squadStakeMsg.Stake.Nfts {
		result := h.db.Exec(`
			UPDATE nfts AS n
			SET 
				locked_on = ?
			FROM 
				teritori_collections AS tc,
				teritori_nfts AS tn 
			WHERE 
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id 
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, lockedOn, nft.ContractAddr, nft.TokenId)
		if result.Error != nil {
			return errors.New("failed to update lockedOn")
		}
	}

	return nil
}

// Increase score on P2eLeaderboard when user unstake
// Remote unstaked staking
func (h *Handler) handleExecuteSquadUnstake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	unstakedTokenIds := e.Events["wasm.token_id"]
	if len(unstakedTokenIds) == 0 {
		return errors.New("no token_id")
	}

	userId := h.config.Network.UserID(execMsg.Sender)

	// Get current squad stakings
	var squadStakings []indexerdb.P2eSquadStaking
	q1 := &indexerdb.P2eSquadStaking{
		OwnerID: userId,
	}

	if err := h.db.Where(q1).Find(&squadStakings).Error; err != nil {
		return errors.Wrap(err, "failed to get current squad staking")
	}

	for _, squadStaking := range squadStakings {
		// NOTE: an NFT cannot be in multi squad at a given time so we can
		// check if a squad is unstaked just by checking just one NFT in that squad
		// to see if it's in the unstakedTokenIds.
		squadFirstTokenId := strings.Split(squadStaking.TokenIDs, ",")[0]
		isUnstaked := false
		for _, unstakedTokenId := range unstakedTokenIds {
			if unstakedTokenId == squadFirstTokenId {
				isUnstaked = true
			}
		}

		if !isUnstaked {
			continue
		}

		// Get staking duration and delete staking object
		stakingDuration := squadStaking.EndTime - squadStaking.StartTime
		if err := h.db.Delete(&squadStaking).Error; err != nil {
			return errors.Wrap(err, "failed to remove current squad staking")
		}

		// Get current leaderboard record
		startTimeDt := time.Unix(int64(squadStaking.StartTime), 0)
		season, _, err := p2e.GetSeasonByTime(startTimeDt)
		if err != nil {
			return errors.Wrap(err, "failed to get season")
		}
		seasonId := season.ID

		// Unstake NFTs from previous contracts
		if execMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV1 {
			seasonId = "Season 1"
		}

		var userScore indexerdb.P2eLeaderboard
		q2 := &indexerdb.P2eLeaderboard{
			UserID:   userId,
			SeasonID: seasonId,
		}
		// Normally, an user score record has to exist here (created when first stake)
		if err := h.db.Where(q2).First(&userScore).Error; err != nil {
			return errors.Wrap(err, "failed to get current user score")
		}

		// For S3: If staking ended yesterday then do not count because it have been reset at midnight already
		now := time.Now()
		dayBeginningTimestamp := time.Date(now.UTC().Year(), now.UTC().Month(), now.UTC().Day(), 0, 0, 0, 0, time.UTC).Unix()

		var adjustedStakingDuration uint64
		if squadStaking.EndTime <= uint64(dayBeginningTimestamp) {
			adjustedStakingDuration = 0
		} else if squadStaking.StartTime < uint64(dayBeginningTimestamp) {
			adjustedStakingDuration = squadStaking.EndTime - uint64(dayBeginningTimestamp)
		} else {
			adjustedStakingDuration = stakingDuration
		}

		// Update score
		if err := h.db.Model(&indexerdb.P2eLeaderboard{
			UserID:   userId,
			SeasonID: seasonId,
		}).UpdateColumn("score", gorm.Expr("score + ?", adjustedStakingDuration)).Error; err != nil {
			return errors.Wrap(err, "failed to update user score")
		}
	}

	// Update lockedOn: remove lockedOn
	contractAddresses := e.Events["wasm._contract_address"]

	if len(contractAddresses) != len(unstakedTokenIds) {
		return errors.New("failed to get transfer data from event")
	}

	for idx, tokenId := range unstakedTokenIds {
		nftContractAddress := contractAddresses[idx]

		result := h.db.Exec(`
			UPDATE nfts AS n
			SET locked_on = NULL
			FROM
				teritori_collections AS tc,
				teritori_nfts AS tn
			WHERE
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, nftContractAddress, tokenId)
		if result.Error != nil {
			return errors.New("failed to update lockedOn")
		}
	}

	return nil
}
