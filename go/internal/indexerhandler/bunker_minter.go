package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/contracts/bunker_minter_types"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/davecgh/go-spew/spew"
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

	// create collection
	collectionId := indexerdb.TeritoriCollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:       collectionId,
		Network:  marketplacepb.Network_NETWORK_TERITORI,
		Name:     minterInstantiateMsg.NftName,
		ImageURI: metadata.ImageURI,
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

type BunkerMetadata struct {
	Name     string `json:"name"`
	ImageURL string `json:"image"`
}

func (h *Handler) handleExecuteMintBunker(e *Message, collection *indexerdb.Collection, tokenId string, execMsg *wasmtypes.MsgExecuteContract) error {
	recipients := e.Events["wasm.recipient"]
	if len(recipients) < 1 {
		return errors.New("no recipients")
	}
	owner := recipients[0]
	ownerId := indexerdb.TeritoriUserID(owner)

	nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

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
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID: tokenId,
		},
	}
	if err := h.db.Create(&nft).Error; err != nil {
		spew.Dump(nft)
		return errors.Wrap(err, "failed to create nft in db")
	}

	// create mint activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   indexerdb.TeritoriActiviyID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindMint,
		Time: e.BlockTime,
		Mint: &indexerdb.Mint{
			// TODO: get price
			BuyerID: ownerId,
		},
		NFTID: nftId,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create mint activity")
	}

	h.logger.Info("minted nft", zap.String("id", nftId), zap.String("owner-id", string(ownerId)))

	return nil
}

type BunkerUpdateConfigMsg struct {
	Payload struct {
		Owner *string `json:"owner"`
	} `json:"update_config"`
}

func (h *Handler) handleExecuteBunkerUpdateConfig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var msg BunkerUpdateConfigMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal tns set_adming_address msg")
	}

	if msg.Payload.Owner != nil {
		if err := h.db.
			Model(&indexerdb.TeritoriCollection{}).
			Where("collection_id = ?", indexerdb.TeritoriCollectionID(execMsg.Contract)).
			UpdateColumn("CreatorAddress", msg.Payload.Owner).
			Error; err != nil {
			return errors.Wrap(err, "failed to update bunker creator")
		}
		h.logger.Info("updated bunker creator")
	}

	return nil
}
