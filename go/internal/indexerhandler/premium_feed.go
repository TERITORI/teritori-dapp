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

type PremiumFeedNFTInfo struct {
	TokenURI  *string                 `json:"token_uri"`
	Extension PremiumFeedNFTExtension `json:"extension"`
}

/*

pub struct Metadata {
    pub image: Option<String>,
    pub image_data: Option<String>,
    pub external_url: Option<String>,
    pub description: Option<String>,
    pub name: Option<String>,
    pub attributes: Option<Vec<Trait>>,
    pub background_color: Option<String>,
    pub animation_url: Option<String>,
    pub youtube_url: Option<String>,
}

#[cw_serde]
pub struct Trait {
    pub display_type: Option<String>,
    pub trait_type: String,
    pub value: String,
}

*/

type PremiumSubRequest struct {
	Subscribe struct {
		RecipientAddr string `json:"recipient_addr"`
	} `json:"subscribe"`
}

type NFTTrait struct {
	DisplayType *string `json:"display_type"`
	TraitType   string  `json:"trait_type"`
	Value       string  `json:"value"`
}

// converted from rust types above
type PremiumFeedNFTExtension struct {
	Image           *string `json:"image"`
	ImageData       *string `json:"image_data"`
	ExternalURL     *string `json:"external_url"`
	Description     *string `json:"description"`
	Name            *string `json:"name"`
	Attributes      *[]json.RawMessage
	BackgroundColor *string `json:"background_color"`
	AnimationURL    *string `json:"animation_url"`
	YoutubeURL      *string `json:"youtube_url"`
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

	var req PremiumSubRequest
	if err := json.Unmarshal(execMsg.Msg, &req); err != nil {
		return errors.Wrap(err, "failed to unmarshal premium feed subscribe request")
	}

	tokenID, err := e.Events.First("wasm.token_id")
	if err != nil {
		return errors.Wrap(err, "failed to get token id")
	}

	metadata, err := e.Events.First("wasm.nft_info")
	if err != nil {
		return errors.Wrap(err, "failed to get nft metadata")
	}
	var nftInfo PremiumFeedNFTInfo
	if err := json.Unmarshal([]byte(metadata), &nftInfo); err != nil {
		return errors.Wrap(err, "failed to unmarshal nft metadata")
	}

	recipient := req.Subscribe.RecipientAddr
	recipientID := h.config.Network.UserID(recipient)

	buyerID := h.config.Network.UserID(execMsg.Sender)

	nftID := h.config.Network.NFTID(contractAddress, tokenID)

	name := ""
	if nftInfo.Extension.Name != nil {
		name = *nftInfo.Extension.Name
	}
	imageURI := ""
	if nftInfo.Extension.Image != nil {
		imageURI = *nftInfo.Extension.Image
	}

	jsonbAttrs := indexerdb.ArrayJSONB{}
	if nftInfo.Extension.Attributes != nil {
		for _, raw := range *nftInfo.Extension.Attributes {
			jsonbAttrs = append(jsonbAttrs, raw)
		}
	}

	nft := indexerdb.NFT{
		ID:           nftID,
		Name:         name,
		ImageURI:     imageURI,
		NetworkID:    h.config.Network.ID,
		Attributes:   jsonbAttrs,
		CollectionID: h.config.Network.CollectionID(contractAddress),
		OwnerID:      recipientID,
		TeritoriNFT: &indexerdb.TeritoriNFT{
			TokenID:   tokenID,
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

	funds := execMsg.Funds
	if len(funds) != 1 {
		return errors.New("expected exactly one fund")
	}
	amount := funds[0].Amount.String()
	denom := funds[0].Denom

	usdPrice, err := h.usdAmount(denom, amount, blockTime)
	if err != nil {
		return errors.Wrap(err, "failed to get usd price")
	}

	activityID := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)
	activity := indexerdb.Activity{
		ID:        activityID,
		Kind:      indexerdb.ActivityKindMint,
		Time:      blockTime,
		NetworkID: h.config.Network.ID,
		NFTID:     &nftID,

		Mint: &indexerdb.Mint{
			Price:      amount,
			PriceDenom: denom,
			USDPrice:   usdPrice,
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
