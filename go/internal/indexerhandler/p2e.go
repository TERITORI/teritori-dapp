package indexerhandler

import (
	"encoding/json"
	"strconv"
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

	// create collection
	collectionId := indexerdb.TeritoriCollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:                  collectionId,
		NetworkId:           "teritori", // FIXME: get from networks config
		Name:                minterInstantiateMsg.ChildNftName,
		ImageURI:            metadata.ImageURI,
		MaxSupply:           maxSupply,
		SecondaryDuringMint: true,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  nftAddr,
			CreatorAddress:      instantiateMsg.Sender,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", collectionId))

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

	ownerId := indexerdb.TeritoriUserID(users[0])

	startTime, err := strconv.ParseUint(startTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse start_time")
	}

	endTime, err := strconv.ParseUint(endTimes[0], 0, 64)
	if err != nil {
		return errors.Wrap(err, "unable to parse end_time")
	}

	// TODO: hardcode for the riot game for now,
	// In the future when we need to support multi game, we should detect the nft contracts of staked NFTs
	// to see they belongs to which game
	gameStartedAt := h.config.TheRiotGameStartedAt

	// There must be no squadstake in progress
	var count int64
	if err := h.db.Model(&indexerdb.P2eSquadStaking{}).Where("owner_id  = ?", ownerId).Count(&count).Error; err != nil {
		return errors.Wrap(err, "failed to query current staking")
	}

	if count != 0 {
		return errors.New("data corrupts: we should not have a current staking")
	}

	squadStaking := indexerdb.P2eSquadStaking{
		OwnerID:   ownerId,
		StartTime: startTime,
		EndTime:   endTime,
	}

	if err := h.db.Create(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	// Create leaderboard (by season) record if does not exist
	startTimeDt := time.Unix(int64(startTime), 0)
	season, _, err := p2e.GetSeasonByTime(gameStartedAt, startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:   ownerId,
		SeasonID: season.ID,
	}
	if err := h.db.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get/create user record for leaderboard")
	}

	// Update lockedOn: set lockedOn = contract which holds NFTs
	lockedOn := indexerdb.TeritoriUserID(execMsg.Contract)

	for _, nft := range squadStakeMsg.Stake.Nfts {
		result := h.db.Exec(`
			UPDATE nfts AS n
			SET locked_on = ?
			FROM 
				teritori_collections AS tc,
				teritori_nfts AS tn 
			WHERE 
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id 
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, lockedOn, nft.ContractAddr, nft.TokenId)
		if result.RowsAffected != 1 || result.Error != nil {
			return errors.New("failed to update owner")
		}
	}

	return nil
}

// Increase score on P2eLeaderboard when user unstake
// Remote unstaked staking
func (h *Handler) handleExecuteSquadUnstake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// TODO: hardcode for the riot game for now,
	// In the future when we need to support multi game, we should detect the nft contracts of staked NFTs
	// to see they belongs to which game
	gameStartedAt := h.config.TheRiotGameStartedAt
	userId := indexerdb.TeritoriUserID(execMsg.Sender)

	// Get current squad staking
	var squadStakings []indexerdb.P2eSquadStaking
	q1 := &indexerdb.P2eSquadStaking{
		OwnerID: userId,
	}

	if err := h.db.Where(q1).Find(&squadStakings).Error; err != nil {
		return errors.Wrap(err, "failed to get current squad staking")
	}

	if len(squadStakings) != 1 {
		return errors.New("we should have only one staking at a time")
	}

	squadStaking := squadStakings[0]

	// Get staking duration and delete staking object
	stakingDuration := squadStaking.EndTime - squadStaking.StartTime
	if err := h.db.Delete(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to remove current squad staking")
	}

	// Get current leaderboard record
	startTimeDt := time.Unix(int64(squadStaking.StartTime), 0)
	season, _, err := p2e.GetSeasonByTime(gameStartedAt, startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:   userId,
		SeasonID: season.ID,
	}
	// Normally, an user score record has to exist here (created when first stake)
	if err := h.db.Where(q2).First(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get current user score")
	}

	// Update score
	if err := h.db.Model(&userScore).
		UpdateColumn("score", gorm.Expr("score  + ?", stakingDuration)).
		UpdateColumn("in_progress_score", gorm.Expr("score")).
		Error; err != nil {
		return errors.Wrap(err, "failed to update user score")
	}

	// Update lockedOn: remove lockedOn
	contractAddresses := e.Events["wasm._contract_address"]
	tokenIds := e.Events["wasm.token_id"]

	if len(contractAddresses) != len(tokenIds) {
		return errors.New("failed to get transfer data from event")
	}

	for idx, tokenId := range tokenIds {
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
		if result.RowsAffected != 1 || result.Error != nil {
			return errors.New("failed to update owner")
		}
	}

	return nil
}
