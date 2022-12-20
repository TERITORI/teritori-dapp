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

	// TODO: change to dynamic when support squad staking for any collection
	theRiotCollectionId := indexerdb.TeritoriCollectionID(h.config.TheRiotCollectionAddress)

	squadStaking := indexerdb.P2eSquadStaking{
		OwnerID:      ownerId,
		StartTime:    startTime,
		EndTime:      endTime,
		CollectionID: theRiotCollectionId,
	}

	if err := h.db.FirstOrCreate(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to create squad staking")
	}

	// Create leaderboard (by season) record if does not exist
	startTimeDt := time.Unix(int64(startTime), 0)
	season, _, err := p2e.GetSeasonByTime(h.config.TheRiotStartedAt, startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:       ownerId,
		CollectionID: theRiotCollectionId,
		SeasonID:     season.ID,
	}
	if err := h.db.Where(q2).FirstOrCreate(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get/create user record for leaderboard")
	}

	// Update owner: transfer to SquadStakingContract
	newOwnerId := indexerdb.TeritoriUserID(execMsg.Contract)
	senderId := indexerdb.TeritoriUserID(execMsg.Sender)

	for _, nft := range squadStakeMsg.Stake.Nfts {
		result := h.db.Exec(`
			UPDATE nfts AS n
			SET owner_id = ?
			FROM 
				teritori_collections AS tc,
				teritori_nfts AS tn 
			WHERE 
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id 
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
				AND n.owner_id = ?
		`, newOwnerId, nft.ContractAddr, nft.TokenId, senderId)
		if result.RowsAffected != 1 || result.Error != nil {
			return errors.New("failed to update owner")
		}
	}

	return nil
}

// Increase score on P2eLeaderboard when user unstake
// Remote unstaked staking
func (h *Handler) handleExecuteSquadUnstake(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// TODO: change to dynamic when support squad staking for any collection
	theRiotCollectionId := indexerdb.TeritoriCollectionID(h.config.TheRiotCollectionAddress)

	userId := indexerdb.TeritoriUserID(execMsg.Sender)

	// Get current squad staking
	var squadStaking indexerdb.P2eSquadStaking
	q1 := &indexerdb.P2eSquadStaking{
		OwnerID:      userId,
		CollectionID: theRiotCollectionId,
	}
	if err := h.db.Where(q1).First(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to get current squad staking")
	}

	// Get staking duration and delete staking object
	stakingDuration := squadStaking.EndTime - squadStaking.StartTime
	if err := h.db.Delete(&squadStaking).Error; err != nil {
		return errors.Wrap(err, "failed to remove current squad staking")
	}

	// Get current leaderboard record
	startTimeDt := time.Unix(int64(squadStaking.StartTime), 0)
	season, _, err := p2e.GetSeasonByTime(h.config.TheRiotStartedAt, startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	var userScore indexerdb.P2eLeaderboard
	q2 := &indexerdb.P2eLeaderboard{
		UserID:       userId,
		CollectionID: theRiotCollectionId,
		SeasonID:     season.ID,
	}
	// Normally, an user score record has to exist here (created when first stake)
	if err := h.db.Where(q2).First(&userScore).Error; err != nil {
		return errors.Wrap(err, "failed to get current user score")
	}

	// Update score
	if err := h.db.Model(&userScore).UpdateColumn("score", gorm.Expr("score  + ?", stakingDuration)).Error; err != nil {
		return errors.Wrap(err, "failed to update user score")
	}

	// Update owner: transfer back to owner
	contractAddresses := e.Events["wasm._contract_address"]
	tokenIds := e.Events["wasm.token_id"]
	newOwnerId := indexerdb.TeritoriUserID(execMsg.Sender)

	if len(contractAddresses) != len(tokenIds) {
		return errors.New("failed to get transfer data from event")
	}

	for idx, tokenId := range tokenIds {
		nftContractAddress := contractAddresses[idx]

		result := h.db.Exec(`
			UPDATE nfts AS n
			SET owner_id = ?
			FROM
				teritori_collections AS tc,
				teritori_nfts AS tn
			WHERE
				n.collection_id = tc.collection_id
				AND tn.nft_id = n.id
				AND tc.nft_contract_address = ?
				AND tn.token_id = ?
		`, newOwnerId, nftContractAddress, tokenId)
		if result.RowsAffected != 1 || result.Error != nil {
			return errors.New("failed to update owner")
		}
	}

	return nil
}
