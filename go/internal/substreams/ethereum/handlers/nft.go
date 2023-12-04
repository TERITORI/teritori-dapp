package handlers

import (
	"math/big"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm/clause"
)

type TransferInput struct {
	From    common.Address `json:"from"`
	To      common.Address `json:"to"`
	TokenID *big.Int       `json:"tokenId"`
}

func (h *Handler) handleTransferFrom(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	nftContract := tx.Info.To

	var input TransferInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse transfer input")
	}

	var collection indexerdb.TeritoriCollection
	if err := h.indexerDB.Where("nft_contract_address = ? AND network_id = ?", nftContract, h.network.ID).First(&collection).Error; err != nil {
		return errors.Wrap(err, "failed to get collection")
	}

	nftId := h.network.NFTID(collection.MintContractAddress, input.TokenID.String())
	var nft indexerdb.NFT
	if err := h.indexerDB.Where("id", nftId).First(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to get nft")
	}

	nft.OwnerID = h.network.UserID(input.To.String())

	if err := h.indexerDB.Save(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to update nft owner")
	}

	// Create send activity
	if err := h.indexerDB.Create(&indexerdb.Activity{
		ID:   h.network.ActivityID(tx.Info.Hash, int(tx.Receipt.Logs[0].Index)),
		Kind: indexerdb.ActivityKindSendNFT,
		Time: time.Unix(int64(tx.Clock.Timestamp), 0),
		SendNFT: &indexerdb.SendNFT{
			Sender:    h.network.UserID(input.From.String()),
			Receiver:  h.network.UserID(input.To.String()),
			NetworkID: collection.NetworkID,
		},
		NFTID:     nftId,
		NetworkID: collection.NetworkID,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create send activity")
	}

	return nil
}

func (h *Handler) handleInitialize(tx *pb.Tx) error {
	metaData := abiGo.TeritoriNFTMetaData
	contractABI, err := metaData.GetAbi()
	if err != nil {
		return errors.Wrap(err, "failed to parse teritori nft abi")
	}

	method, err := ParseMethod(contractABI, tx.Calls[2].Input)
	if err != nil {
		return errors.Wrap(err, "failed to parse method")
	}

	args := make(map[string]interface{})
	if err := method.Inputs.UnpackIntoMap(args, []byte(tx.Calls[2].Input[4:])); err != nil {
		return errors.Wrap(err, "failed to unpack args for "+method.Name)
	}

	contractURI := args["_contractURI"].(string)
	collectionName := args["_name"].(string)

	minterAddress := tx.Calls[2].Caller
	nftAddress := tx.Calls[2].Address

	// try to fetch collection metadata
	metadataURI := contractURI
	var metadata CollectionMetadata

	if err := FetchIPFSJSON(metadataURI, &metadata); err != nil {
		h.logger.Error("failed to fetch collection metadata", zap.String("metadata-uri", metadataURI), zap.Error(err))
	}

	collectionId := h.network.CollectionID(minterAddress)
	network, _, err := h.networkStore.ParseCollectionID(string(collectionId))
	if err != nil {
		return errors.Wrap(err, "failed to get network from collectionID")
	}

	newCollection := &indexerdb.Collection{
		ID:                  collectionId,
		NetworkID:           network.GetBase().ID,
		Name:                collectionName,
		ImageURI:            metadata.ImageURI,
		MaxSupply:           0,
		SecondaryDuringMint: false,
		Time:                time.Unix(int64(tx.Clock.Timestamp), 0),
		TeritoriCollection: &indexerdb.TeritoriCollection{
			NetworkID:           network.GetBase().ID,
			MintContractAddress: minterAddress,
			NFTContractAddress:  nftAddress,
			CreatorAddress:      tx.Info.From,
		},
	}

	if err := h.dbTransaction.Clauses(clause.OnConflict{DoNothing: true}).Create(newCollection).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", string(collectionId)))

	return nil
}
