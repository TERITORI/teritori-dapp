package indexerhandler

import (
	"encoding/json"
	"strings"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type TNSInstantiateMsg struct {
	Name         string `json:"name"`
	AdminAddress string `json:"admin_address"`
}

func (h *Handler) handleInstantiateTNS(e *Message, contractAddress string, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	var tnsInstantiateMsg TNSInstantiateMsg
	if err := json.Unmarshal(instantiateMsg.Msg.Bytes(), &tnsInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal minter instantiate msg")
	}

	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create collection
	collectionId := h.config.Network.CollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:                  collectionId,
		NetworkId:           h.config.Network.ID,
		Name:                tnsInstantiateMsg.Name,
		ImageURI:            h.config.Network.NameServiceDefaultImage,
		MaxSupply:           -1,
		SecondaryDuringMint: true,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  contractAddress,
			CreatorAddress:      tnsInstantiateMsg.AdminAddress,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created tns collection", zap.String("id", string(collectionId)))

	return nil
}

type TNSMetadata struct {
	ImageURI *string `json:"image"`
}

type CW721MintMsg struct {
	/// Unique ID of the NFT
	TokenID string `json:"token_id"`
	/// The owner of the newly minter NFT
	Owner string `json:"owner"`
	/// Universal resource identifier for this NFT
	/// Should point to a JSON file that conforms to the ERC721
	/// Metadata JSON Schema
	TokenURI string `json:"token_uri"`
	/// Any custom extension used by this contract
	Extension json.RawMessage `json:"extension"`
}

type ExecuteCW721MintMsg struct {
	Mint CW721MintMsg `json:"mint"`
}

func (h *Handler) handleExecuteMintTNS(e *Message, collection *indexerdb.Collection, tokenId string, execMsg *wasmtypes.MsgExecuteContract) error {
	minter := execMsg.Sender
	ownerId := h.config.Network.UserID(minter)
	tokenId = strings.ToLower(tokenId) // mint action in name service contract emits non-normalized token id in events
	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	// get image URI
	var executePayload ExecuteCW721MintMsg
	if err := json.Unmarshal(execMsg.Msg, &executePayload); err != nil {
		return errors.Wrap(err, "failed to unmarshal mint msg")
	}
	var metadata TNSMetadata
	if err := json.Unmarshal(executePayload.Mint.Extension, &metadata); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}
	imageURI := ""
	if metadata.ImageURI != nil {
		imageURI = *metadata.ImageURI
	}

	// create nft in db
	nft := indexerdb.NFT{
		ID:           nftId,
		OwnerID:      ownerId,
		Name:         tokenId,
		ImageURI:     imageURI,
		CollectionID: collection.ID,
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID: tokenId,
		},
	}
	var count int64
	if err := h.db.Model(&indexerdb.NFT{}).Where(&indexerdb.NFT{ID: nftId}).Count(&count).Error; err != nil {
		return errors.Wrap(err, "failed to count number of existent nft")
	}
	if count == 0 {
		//New Nft
		if err := h.db.Create(&nft).Error; err != nil {
			return errors.Wrap(err, "failed to create nft in db")
		}
		h.logger.Info("created tns domain", zap.String("id", string(nftId)), zap.String("owner-id", string(ownerId)))
	} else {
		updates := map[string]interface{}{
			"burnt":     false,
			"owner_id":  string(ownerId),
			"image_uri": "",
		}
		if metadata.ImageURI != nil {
			updates["image_uri"] = *metadata.ImageURI
		}
		//NFT existant just update it
		err := h.db.Model(&indexerdb.NFT{ID: nftId}).UpdateColumns(updates).Error
		if err != nil {
			return errors.Wrap(err, "failed to create nft in db")
		}
	}

	// complete quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    ownerId,
		QuestID:   "book_tns",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save quest completion")
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

	return nil
}

type TNSUpdateMetadataMsg struct {
	Payload struct {
		TokenID  string      `json:"token_id"`
		Metadata TNSMetadata `json:"metadata"`
	} `json:"update_metadata"`
}

func (h *Handler) handleExecuteUpdateTNSMetadata(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if execMsg.Contract != h.config.Network.NameServiceContractAddress {
		return nil
	}

	var msg TNSUpdateMetadataMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal tns update_metadata msg")
	}

	h.logger.Debug("tns update", zap.Any("msg", msg), zap.String("raw", string(execMsg.Msg)))

	if msg.Payload.Metadata.ImageURI != nil {
		if err := h.db.
			Model(&indexerdb.NFT{}).
			Where("id = ?", h.config.Network.NFTID(execMsg.Contract, msg.Payload.TokenID)).
			UpdateColumn("ImageURI", *msg.Payload.Metadata.ImageURI).
			Error; err != nil {
			return errors.Wrap(err, "failed to update tns image uri")
		}
		h.logger.Info("updated tns image")
	}

	return nil
}

type TNSSetAdminAddressMsg struct {
	Payload struct {
		AdminAddress string `json:"admin_address"`
	} `json:"set_admin_address"`
}

func (h *Handler) handleExecuteTNSSetAdminAddress(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	if execMsg.Contract != h.config.Network.NameServiceContractAddress {
		return nil
	}

	var msg TNSSetAdminAddressMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal tns set_adming_address msg")
	}

	if err := h.db.
		Model(&indexerdb.TeritoriCollection{}).
		Where("collection_id = ?", h.config.Network.CollectionID(execMsg.Contract)).
		UpdateColumn("CreatorAddress", msg.Payload.AdminAddress).
		Error; err != nil {
		return errors.Wrap(err, "failed to update tns creator")
	}
	h.logger.Info("updated tns creator")

	return nil
}
