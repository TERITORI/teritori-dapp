package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type TNSInstantiateMsg struct {
	Name string `json:"name"`
}

func (h *Handler) handleInstantiateTNS(e *Message, contractAddress string, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	var tnsInstantiateMsg TNSInstantiateMsg
	if err := json.Unmarshal(instantiateMsg.Msg.Bytes(), &tnsInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal minter instantiate msg")
	}

	// create collection
	collectionId := indexerdb.TeritoriCollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:       collectionId,
		Network:  marketplacepb.Network_NETWORK_TERITORI,
		Name:     tnsInstantiateMsg.Name,
		ImageURI: h.config.TNSDefaultImageURL,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  contractAddress,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created tns collection", zap.String("id", collectionId))

	return nil
}

type TNSMetadata struct {
	ImageURI string `json:"image"`
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
	ownerId := indexerdb.TeritoriUserID(minter)

	nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

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
	if metadata.ImageURI != "" {
		imageURI = metadata.ImageURI
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
	if err := h.db.Create(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to create nft in db")
	}
	h.logger.Info("created tns domain", zap.String("id", nftId), zap.String("owner-id", string(ownerId)))

	// complete quest
	if err := h.db.Save(&indexerdb.QuestCompletion{
		UserID:    ownerId,
		QuestID:   "book_tns",
		Completed: true,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to save quest completion")
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

	return nil
}
