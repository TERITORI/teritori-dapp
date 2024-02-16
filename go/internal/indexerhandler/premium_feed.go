package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func (h *Handler) handleInstantiatePremiumFeedMemberships(e *Message, instantiateMsg *wasmtypes.MsgInstantiateContract) error {
	contractAddress, err := e.Events.First("instantiate._contract_address")
	if err != nil {
		return errors.Wrap(err, "failed to get contract address")
	}
	pmFeature, err := h.config.Network.GetFeatureCosmWasmPremiumFeed()
	if err != nil {
		if errors.Is(err, networks.ErrFeatureNotFound) {
			h.logger.Debug("ignored instantiate premium feed for network without premium feed feature")
			return nil
		}
		return errors.Wrap(err, "failed to get feature")
	}
	if contractAddress != pmFeature.MembershipContractAddress {
		h.logger.Debug("ignored instantiate premium feed for non-matching contract")
		return nil
	}

	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	collection := indexerdb.Collection{
		ID:                  h.config.Network.CollectionID(contractAddress),
		NetworkID:           h.config.Network.ID,
		Name:                "Premium Memberships",
		ImageURI:            "",
		MaxSupply:           -1,
		SecondaryDuringMint: true,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  contractAddress,
			CreatorAddress:      instantiateMsg.Sender,
			Denom:               pmFeature.MintDenom,
			NetworkID:           h.config.Network.ID,
		},
	}

	if err := h.db.Create(&collection).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}

	h.logger.Info("created premium feed collection", zap.Any("collection-id", collection.ID))

	return nil
}

type PremiumFeedNFT struct {
	Name            string `json:"name"`
	Description     string `json:"description"`
	ImageURI        string `json:"image_uri"`
	StartTime       string `json:"start_time"`
	DurationSeconds string `json:"duration_seconds"`
	OwnerAddress    string `json:"owner_addr"`
}

func (h *Handler) handleExecutePremiumFeedSubscribe(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// TODO: only register this handler if the network has the premium feed feature
	pmFeature, err := h.config.Network.GetFeatureCosmWasmPremiumFeed()
	if err != nil {
		if errors.Is(err, networks.ErrFeatureNotFound) {
			return nil
		}
		return errors.Wrap(err, "failed to get feature")
	}

	contractAddress := execMsg.Contract

	if contractAddress != pmFeature.MembershipContractAddress {
		h.logger.Debug("ignored instantiate premium feed for non-matching contract")
		return nil
	}

	metadata, err := e.Events.First("wasm.nft_metadata")
	if err != nil {
		return errors.Wrap(err, "failed to get nft metadata")
	}
	var nftData PremiumFeedNFT
	if err := json.Unmarshal([]byte(metadata), &nftData); err != nil {
		return errors.Wrap(err, "failed to unmarshal nft metadata")
	}

	recipient, err := e.Events.First("wasm.recipient_addr")
	if err != nil {
		return errors.Wrap(err, "failed to get recipient")
	}
	recipientID := h.config.Network.UserID(recipient)

	buyerID := h.config.Network.UserID(execMsg.Sender)

	nftID := h.config.Network.NFTID(contractAddress, "42")

	nft := indexerdb.NFT{
		ID:           nftID,
		Name:         nftData.Name,
		ImageURI:     nftData.ImageURI,
		NetworkID:    h.config.Network.ID,
		CollectionID: h.config.Network.CollectionID(contractAddress),
		OwnerID:      recipientID,
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID:   "42",
			NetworkID: h.config.Network.ID,
		},
	}

	if err := h.db.Create(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}

	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	activityID := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)
	activity := indexerdb.Activity{
		ID:        activityID,
		Kind:      indexerdb.ActivityKindMint,
		Time:      blockTime,
		NetworkID: h.config.Network.ID,
		NFTID:     &nftID,

		Mint: &indexerdb.Mint{
			Price:      "42",                // FIXME
			PriceDenom: pmFeature.MintDenom, // FIXME
			USDPrice:   42,                  // FIXME
			BuyerID:    buyerID,
			NetworkID:  h.config.Network.ID,
		},
	}
	if err := h.db.Create(&activity).Error; err != nil {
		return errors.Wrap(err, "failed to create activity")
	}

	h.logger.Info("created premium feed nft", zap.Any("id", nftID))

	return nil
}
