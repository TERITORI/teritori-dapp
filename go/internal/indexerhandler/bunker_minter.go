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
		NetworkID:           network.GetBase().ID,
		Name:                minterInstantiateMsg.NftName,
		ImageURI:            metadata.ImageURI,
		MaxSupply:           maxSupply,
		SecondaryDuringMint: secondaryDuringMint,
		Time:                blockTime,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			NetworkID:           network.GetBase().ID,
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

type RequestMintMsg struct {
	RequestMint struct {
		Addr string `json:"addr"`
	} `json:"request_mint"`
}

type BatchRequestMintMsg struct {
	BatchRequestMint struct {
		Addr  string `json:"addr"`
		Count uint64 `json:"count"`
	} `json:"batch_request_mint"`
}

func (h *Handler) handleExecuteBunkerBatchRequestMint(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	minterContractAddress := execMsg.Contract
	collectionId := h.config.Network.CollectionID(minterContractAddress)
	var collection indexerdb.Collection
	if err := h.db.Where("id = ?", collectionId).First(&collection).Error; err != nil {
		h.logger.Debug("ignored request mint for unknown collection", zap.String("collection-id", string(collectionId)))
		return nil
	}

	requestMintMsg := BatchRequestMintMsg{}
	if err := json.Unmarshal(execMsg.Msg, &requestMintMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal request mint msg")
	}

	owner := requestMintMsg.BatchRequestMint.Addr
	ownerId := h.config.Network.UserID(owner)
	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// get price
	amount := "0"
	denom := ""
	usdAmount := 0.0
	if len(execMsg.Funds) != 0 {
		if len(execMsg.Funds) != 1 {
			return errors.New("expected 1 coin in funds")
		}
		amount = execMsg.Funds[0].Amount.String()
		denom = execMsg.Funds[0].Denom
		var err error
		usdAmount, err = h.usdAmount(denom, amount, blockTime)
		if err != nil {
			return errors.Wrap(err, "failed to get usd price")
		}
	}

	// create request mint activities
	activities := make([]indexerdb.Activity, requestMintMsg.BatchRequestMint.Count)
	for i := uint64(0); i < requestMintMsg.BatchRequestMint.Count; i++ {
		activityId := h.config.Network.SubActivityID(e.TxHash, e.MsgIndex, int(i))
		activities[i] = indexerdb.Activity{
			ID:           activityId,
			Kind:         indexerdb.ActivityKindRequestMint,
			Time:         blockTime,
			CollectionID: &collectionId,
			RequestMint: &indexerdb.RequestMint{
				BuyerID:      ownerId,
				NetworkID:    collection.NetworkID,
				CollectionID: collection.ID,
				Price:        amount,
				PriceDenom:   denom,
				USDPrice:     usdAmount,
				Minted:       false,
			},
			NetworkID: collection.NetworkID,
		}
	}

	// batch create request mint activities
	if err := h.db.Create(&activities).Error; err != nil {
		return errors.Wrap(err, "failed to create request mint activities")
	}

	h.logger.Info("batch mint requested", zap.Uint64("count", requestMintMsg.BatchRequestMint.Count), zap.String("collection-id", string(collection.ID)), zap.String("owner-id", string(ownerId)))

	return nil
}

func (h *Handler) handleExecuteBunkerRequestMint(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	minterContractAddress := execMsg.Contract
	collectionId := h.config.Network.CollectionID(minterContractAddress)
	var collection indexerdb.Collection
	if err := h.db.Where("id = ?", collectionId).First(&collection).Error; err != nil {
		h.logger.Debug("ignored request mint for unknown collection", zap.String("collection-id", string(collectionId)))
		return nil
	}

	requestMintMsg := RequestMintMsg{}
	if err := json.Unmarshal(execMsg.Msg, &requestMintMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal request mint msg")
	}

	owner := requestMintMsg.RequestMint.Addr
	ownerId := h.config.Network.UserID(owner)

	activityId := h.config.Network.ActivityID(e.TxHash, e.MsgIndex)

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// get price
	amount := "0"
	denom := ""
	usdAmount := 0.0
	if len(execMsg.Funds) != 0 {
		if len(execMsg.Funds) != 1 {
			return errors.New("expected 1 coin in funds")
		}
		amount = execMsg.Funds[0].Amount.String()
		denom = execMsg.Funds[0].Denom
		var err error
		usdAmount, err = h.usdAmount(denom, amount, blockTime)
		if err != nil {
			return errors.Wrap(err, "failed to get usd price")
		}
	}

	// create request mint activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   activityId,
		Kind: indexerdb.ActivityKindRequestMint,
		Time: blockTime,
		RequestMint: &indexerdb.RequestMint{
			BuyerID:      ownerId,
			NetworkID:    collection.NetworkID,
			CollectionID: collection.ID,
			Price:        amount,
			PriceDenom:   denom,
			USDPrice:     usdAmount,
			Minted:       false,
		},
		NetworkID: collection.NetworkID,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create request mint activity")
	}

	h.logger.Info("mint requested", zap.String("collection-id", string(collection.ID)), zap.String("owner-id", string(ownerId)))

	return nil
}

func (h *Handler) handleExecuteMintBunker(e *Message, collection *indexerdb.Collection, tokenId string, execMsg *wasmtypes.MsgExecuteContract) error {
	recipientAddr, err := e.Events.First("wasm.recipient")
	if err != nil {
		return errors.Wrap(err, "failed to get recipient address")
	}
	ownerId := h.config.Network.UserID(recipientAddr)

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
			TokenID:   tokenId,
			NetworkID: h.config.Network.ID,
		},
		NetworkID: h.config.Network.ID,
	}

	if err := h.db.Create(&nft).Error; err != nil {
		return errors.Wrap(err, "failed to create nft in db")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// get amount and usd price
	var requestActivity indexerdb.Activity
	if err := h.db.Model(&indexerdb.Activity{}).
		Preload("RequestMint").
		Joins("JOIN request_mints ON activities.id = request_mints.activity_id").
		Where("kind = 'request-mint' AND request_mints.buyer_id = ? AND request_mints.collection_id = ? AND request_mints.minted = false", ownerId, collection.ID).
		Order("time asc").
		First(&requestActivity).Error; err != nil {
		return errors.Wrap(err, "failed to get mint request")
	}
	if requestActivity.RequestMint == nil {
		return errors.New("no mint request on activity")
	}
	amount := requestActivity.RequestMint.Price
	denom := requestActivity.RequestMint.PriceDenom
	usdPrice := requestActivity.RequestMint.USDPrice

	// mark request as minted
	requestActivity.RequestMint.Minted = true
	if err := h.db.Save(requestActivity.RequestMint).Error; err != nil {
		return errors.Wrap(err, "failed to mark request as minted")
	}

	// create mint activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindMint,
		Time: blockTime,
		Mint: &indexerdb.Mint{
			BuyerID:    ownerId,
			NetworkID:  collection.NetworkID,
			Price:      amount,
			PriceDenom: denom,
			USDPrice:   usdPrice,
		},
		NFTID:        &nftId,
		CollectionID: &collection.ID,
		NetworkID:    collection.NetworkID,
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
		NFTMaxSupply        *string `json:"nft_max_supply"`
	} `json:"update_config"`
}

func (h *Handler) handleExecuteBunkerUpdateConfig(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var msg BunkerUpdateConfigMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal tns set_adming_address msg")
	}

	totalUpdates := 0

	{
		updates := make(map[string]interface{})
		if msg.Payload.Owner != nil {
			updates["CreatorAddress"] = *msg.Payload.Owner
		}
		if len(updates) != 0 {
			if err := h.db.
				Model(&indexerdb.TeritoriCollection{}).
				Where("collection_id = ?", h.config.Network.CollectionID(execMsg.Contract)).
				UpdateColumns(updates).
				Error; err != nil {
				return errors.Wrap(err, "failed to update bunker creator")
			}
			totalUpdates += len(updates)
		}
	}

	{
		updates := make(map[string]interface{})
		if msg.Payload.SecondaryDuringMint != nil {
			updates["SecondaryDuringMint"] = *msg.Payload.SecondaryDuringMint
		}
		if msg.Payload.NFTMaxSupply != nil {
			updates["MaxSupply"] = *msg.Payload.NFTMaxSupply
		}
		if len(updates) != 0 {
			if err := h.db.
				Model(&indexerdb.Collection{}).
				Where("id = ?", h.config.Network.CollectionID(execMsg.Contract)).
				UpdateColumns(updates).
				Error; err != nil {
				return errors.Wrap(err, "failed to update bunker creator")
			}
			totalUpdates += len(updates)
		}
	}

	h.logger.Info("updated bunker config", zap.Int("total-updates", totalUpdates))

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
