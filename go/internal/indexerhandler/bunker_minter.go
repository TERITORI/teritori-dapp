package indexerhandler

import (
	"encoding/json"
	"strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contracts/bunker_minter_types"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (h *Handler) handleInstantiateBunker(e *Message, contractAddress string, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	// get nft contract address
	nftAddrs := e.Events["wasm.nft_addr"]
	if len(nftAddrs) == 0 {
		return errors.New("no nft contract address")
	}
	nftAddr := nftAddrs[0]

	var minterInstantiateMsg bunker_minter_types.InstantiateMsg
	if err := json.Unmarshal(instantiateMsg.Msg.Bytes(), &minterInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal minter instantiate msg")
	}

	// FIXME: network queries should be done async

	// try to fetch collection metadata
	metadataURI := minterInstantiateMsg.NftBaseUri
	var metadata CollectionMetadata
	if err := fetchIPFSJSON(metadataURI, &metadata); err != nil {
		h.logger.Error("failed to fetch collection metadata", zap.String("metadata-uri", metadataURI), zap.Error(err))
	}

	maxSupply, err := strconv.Atoi(minterInstantiateMsg.NftMaxSupply)
	if err != nil {
		h.logger.Error("failed to parse nft max supply", zap.Error(err))
		maxSupply = -1
	}

	price, err := strconv.Atoi(minterInstantiateMsg.NftPriceAmount)
	if err != nil {
		h.logger.Error("failed to parse nft price", zap.Error(err))
		price = -1
	}

	secondaryDuringMint := false
	if sdm, ok := minterInstantiateMsg.SecondaryDuringMint.(bool); ok {
		secondaryDuringMint = sdm
	}

	// create collection
	collectionId := h.config.Network.CollectionID(contractAddress)
	network, _, err := h.config.NetworkStore.ParseCollectionID(string(collectionId))
	if err != nil {
		return errors.Wrap(err, "failed to get network from collectionID")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	if err := h.db.Create(&indexerdb.Collection{
		ID:                  collectionId,
		NetworkId:           network.GetBase().ID,
		Name:                minterInstantiateMsg.NftName,
		ImageURI:            metadata.ImageURI,
		MaxSupply:           maxSupply,
		SecondaryDuringMint: secondaryDuringMint,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  nftAddr,
			CreatorAddress:      instantiateMsg.Sender,
			Price:               int64(price),
			Denom:               minterInstantiateMsg.PriceDenom,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", string(collectionId)), zap.Time("time", blockTime))

	return nil
}

type BunkerMetadata struct {
	Name       string               `json:"name"`
	ImageURL   string               `json:"image"`
	Attributes indexerdb.ArrayJSONB `json:"attributes"`
}

func (h *Handler) handleExecuteMintBunker(e *Message, collection *indexerdb.Collection, tokenId string, execMsg *wasmtypes.MsgExecuteContract) error {
	recipients := e.Events["wasm.recipient"]
	if len(recipients) < 1 {
		return errors.New("no recipients")
	}
	owner := recipients[0]
	ownerId := h.config.Network.UserID(owner)

	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	var mintMsg ExecuteCW721MintMsg
	if err := json.Unmarshal(execMsg.Msg, &mintMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal mint msg")
	}
	var metadata BunkerMetadata
	if err := json.Unmarshal(mintMsg.Mint.Extension, &metadata); err != nil {
		return errors.Wrap(err, "failed to unmarhsal metadata")
	}

	nft := indexerdb.NFT{
		ID:           nftId,
		OwnerID:      ownerId,
		Name:         metadata.Name,
		ImageURI:     metadata.ImageURL,
		CollectionID: collection.ID,
		Attributes:   metadata.Attributes,
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID: tokenId,
		},
	}

	if err := h.db.Create(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to create nft in db")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create mint activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindMint,
		Time: blockTime,
		Mint: &indexerdb.Mint{
			// TODO: get price
			BuyerID: ownerId,
		},
		NFTID: nftId,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create mint activity")
	}

	h.logger.Info("minted nft", zap.String("id", string(nftId)), zap.String("owner-id", string(ownerId)))

	return nil
}

type BunkerUpdateConfigMsg struct {
	Payload struct {
		Owner               *string `json:"owner"`
		SecondaryDuringMint *bool   `json:"secondary_during_mint"`
	} `json:"update_config"`
}

func (h *Handler) handleExecuteBunkerUpdateConfig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var msg BunkerUpdateConfigMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal tns set_adming_address msg")
	}

	updates := make(map[string]interface{})

	if msg.Payload.Owner != nil {
		updates["CreatorAddress"] = *msg.Payload.Owner
	}
	if msg.Payload.SecondaryDuringMint != nil {
		updates["SecondaryDuringMint"] = *msg.Payload.SecondaryDuringMint
	}

	if len(updates) != 0 {
		if err := h.db.
			Model(&indexerdb.TeritoriCollection{}).
			Where("collection_id = ?", h.config.Network.CollectionID(execMsg.Contract)).
			UpdateColumns(updates).
			Error; err != nil {
			return errors.Wrap(err, "failed to update bunker creator")
		}
		h.logger.Info("updated bunker config")
	}

	return nil
}

func (h *Handler) handleExecuteBunkerPause(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if err := h.db.
		Model(&indexerdb.Collection{}).
		Where("id = ?", h.config.Network.CollectionID(execMsg.Contract)).
		UpdateColumn("Paused", true).
		Error; err != nil {
		return errors.Wrap(err, "failed to pause bunker")
	}
	h.logger.Info("paused bunker")
	return nil
}

func (h *Handler) handleExecuteBunkerUnpause(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if err := h.db.
		Model(&indexerdb.Collection{}).
		Where("id = ?", h.config.Network.CollectionID(execMsg.Contract)).
		UpdateColumn("Paused", false).
		Error; err != nil {
		return errors.Wrap(err, "failed to unpause bunker")
	}
	h.logger.Info("unpaused bunker")
	return nil
}
