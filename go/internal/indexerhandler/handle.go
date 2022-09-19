package indexerhandler

import (
	"encoding/json"
	"fmt"
	"regexp"
	"time"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	cosmostypes "github.com/cosmos/cosmos-sdk/types"
	cosmostx "github.com/cosmos/cosmos-sdk/types/tx"
	cosmosproto "github.com/cosmos/gogoproto/proto"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	tenderminttypes "github.com/tendermint/tendermint/rpc/core/types"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

const (
	minterCodeID         = "9"
	vaultContractAddress = "tori17ww32dvhrxa9ga57vk65dzu8746nm0cqlqxq06zfrkd0wffpkleslfmjtq"
)

type Tx struct {
	Hash   string
	Tx     *cosmostx.Tx
	Events EventsMap
}

type Handler struct {
	db           *gorm.DB
	restEndpoint string
	logger       *zap.Logger
}

func NewHandler(db *gorm.DB, restEndpoint string, logger *zap.Logger) (*Handler, error) {
	if db == nil {
		return nil, errors.New("nil db")
	}
	if logger == nil {
		logger = zap.NewNop()
	}
	return &Handler{
		db:           db,
		logger:       logger,
		restEndpoint: restEndpoint,
	}, nil
}

func (h *Handler) HandleCosmosTx(tx *cosmostx.Tx, res *cosmostypes.TxResponse) error {
	if res == nil {
		return errors.New("empty result")
	}
	if res.Events == nil {
		return errors.New("nil events map")
	}

	events := EventsMapFromEvents(res.Events)

	return h.HandleTx(&Tx{
		Hash:   res.TxHash,
		Tx:     tx,
		Events: events,
	})
}

func (h *Handler) HandleTendermintResultTx(tx *tenderminttypes.ResultTx) error {
	var log []TendermintTxLog
	if err := json.Unmarshal([]byte(tx.TxResult.Log), &log); err != nil {
		panic(errors.Wrap(err, "failed to parse tx log"))
	}
	allEvents := []StringEvent(nil)
	for _, l := range log {
		allEvents = append(allEvents, l.Events...)
	}
	em := EventsMapFromStringEvents(allEvents)

	var cosmosTx cosmostx.Tx
	if err := cosmosproto.Unmarshal(tx.Tx, &cosmosTx); err != nil {
		return errors.Wrap(err, "failed to unmarshal tx")
	}

	return h.HandleTx(&Tx{
		Hash:   tx.Hash.String(),
		Tx:     &cosmosTx,
		Events: em,
	})
}

func (h *Handler) HandleTx(e *Tx) error {
	messageActions := e.Events["message.action"]
	if len(messageActions) == 0 {
		return nil
	}
	messageAction := messageActions[0]

	switch messageAction {
	case "/cosmwasm.wasm.v1.MsgInstantiateContract":
		if err := h.handleInstantiate(e); err != nil {
			return errors.Wrap(err, "failed to handle instantiate")
		}
	case "/cosmwasm.wasm.v1.MsgExecuteContract":
		if err := h.handleExecute(e); err != nil {
			return errors.Wrap(err, "failed to handle execute")
		}
	}

	return nil
}

func (h *Handler) handleInstantiate(e *Tx) error {
	contractAddress, err := e.Events.InstantiateContractAddress()
	if err != nil {
		return errors.Wrap(err, "failed to get outer contract address")
	}

	codeId, err := e.Events.OuterInstantiateCodeID()
	if err != nil {
		return errors.Wrap(err, "failed to get outer code id")
	}

	switch codeId {
	case minterCodeID:
		if err := h.handleInstantiateMinter(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle minter instantiation")
		}
	default:
		h.logger.Debug("ignored instantiate with unknown code id", zap.String("value", codeId))
	}

	return nil
}

func (h *Handler) handleInstantiateMinter(e *Tx, contractAddress string) error {
	// get nft contract address
	nftAddrs := e.Events["wasm.nft_addr"]
	if len(nftAddrs) == 0 {
		return errors.New("no nft contract address")
	}
	nftAddr := nftAddrs[0]

	// FIXME: network queries should be done async

	// fetch minter config
	var minterConfig MinterConfigResponse
	if err := querySmartContract(h.restEndpoint, &minterConfig, contractAddress, `{ "config": {} }`); err != nil {
		return errors.Wrap(err, "failed to query minter config")
	}

	// fetch collection info
	var collectionInfo CollectionInfoResponse
	if err := querySmartContract(h.restEndpoint, &collectionInfo, minterConfig.NFTContractAddress, `{ "contract_info": {} }`); err != nil {
		return errors.Wrap(err, "failed to query collection info")
	}

	// fetch collection metadata
	var metadata CollectionMetadata
	if err := fetchIPFSJSON(minterConfig.BaseURI+"collection.json", &metadata); err != nil {
		return errors.Wrap(err, "failed to fetch collection metadata")
	}

	// create collection
	collectionId := indexerdb.TeritoriCollectionID(contractAddress)
	if err := h.db.Create(&indexerdb.Collection{
		ID:       collectionId,
		Network:  indexerdb.NetworkTeritori,
		Name:     collectionInfo.Name,
		ImageURI: metadata.ImageURI,
		TeritoriCollection: &indexerdb.TeritoriCollection{
			MintContractAddress: contractAddress,
			NFTContractAddress:  nftAddr,
		},
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create collection")
	}
	h.logger.Info("created collection", zap.String("id", collectionId))

	return nil
}

func (h *Handler) handleExecute(e *Tx) error {
	contractAddress, err := e.Events.OuterContractAddress()
	if err != nil {
		return errors.Wrap(err, "failed to get outer contract address")
	}

	wasmActions := e.Events["wasm.action"]
	if len(wasmActions) == 0 {
		return errors.New("no wasm action")
	}
	wasmAction := wasmActions[0]

	switch wasmAction {
	case "mint":
		if err := h.handleExecuteMint(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle mint")
		}
	case "buy":
		if err := h.handleExecuteBuy(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle buy")
		}
	case "send_nft":
		if err := h.handleExecuteSendNFT(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle send_nft")
		}
	case "withdraw":
		if err := h.handleExecuteWithdraw(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle withdraw")
		}
	}

	return nil
}

func (h *Handler) handleExecuteMint(e *Tx, contractAddress string) error {
	if err := h.db.Transaction(func(dbtx *gorm.DB) error {
		var collections []*indexerdb.Collection
		if err := dbtx.Preload("TeritoriCollection").Limit(1).Find(&collections, &indexerdb.Collection{ID: indexerdb.TeritoriCollectionID(contractAddress)}).Error; err != nil {
			return errors.Wrap(err, "find collection error")
		}
		if len(collections) == 0 {
			h.logger.Debug("ignored mint from unknown collection", zap.String("address", contractAddress))
			return nil
		}
		collection := collections[0]
		if collection.TeritoriCollection == nil {
			spew.Dump(collection)
			return errors.New("no teritori info in collection")
		}

		tokenIds := e.Events["wasm.token_id"]
		if len(tokenIds) == 0 {
			return errors.New("no token ids")
		}
		tokenId := tokenIds[0]

		owners := e.Events["wasm.owner"]
		if len(owners) == 0 {
			return errors.New("no owners")
		}
		owner := owners[0]
		ownerId := indexerdb.TeritoriUserID(owner)

		var minterConfig MinterConfigResponse
		if err := querySmartContract(h.restEndpoint, &minterConfig, collection.TeritoriCollection.MintContractAddress, `{ "config": {} }`); err != nil {
			return errors.Wrap(err, "failed to query minter config")
		}

		var metadata NFTMetadata
		if err := fetchIPFSJSON(fmt.Sprintf("%s/%s.json", minterConfig.BaseURI, tokenId), &metadata); err != nil {
			return errors.Wrap(err, "failed to fetch nft metadata")
		}

		nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		nft := indexerdb.NFT{
			ID:           nftId,
			OwnerID:      ownerId,
			Name:         metadata.Name,
			ImageURI:     metadata.ImageURI,
			CollectionID: collection.ID,
			TeritoriNFT: &indexerdb.TeritoriNFT{
				TokenID: tokenId,
			},
		}
		if err := dbtx.Create(&nft).Error; err != nil {
			spew.Dump(nft)
			return errors.Wrap(err, "failed to create nft in db")
		}
		h.logger.Info("created nft", zap.String("id", nftId), zap.String("owner-id", string(ownerId)))

		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}

	return nil
}

const sellerReceiverIndex = 1
const buyerSpenderIndex = 0
const priceSpentAmountIndex = 0

var amountRegexp = regexp.MustCompile(`(\d+)(.+)`)

func (h *Handler) handleExecuteBuy(e *Tx, contractAddress string) error {
	// check that it's the correct vault contract
	if contractAddress != vaultContractAddress {
		return nil
	}

	// get nft contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < 2 {
		return errors.New("not enough contract addresses")
	}
	nftContractAddress := executeContractAddresses[1]

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// get buyer
	spenders := e.Events["coin_spent.spender"]
	if len(spenders) < buyerSpenderIndex+1 {
		return fmt.Errorf("not enough spenders, wanted %d, got %d", buyerSpenderIndex+1, len(spenders))
	}
	buyer := spenders[buyerSpenderIndex]

	// get seller
	receivers := e.Events["coin_received.receiver"]
	if len(receivers) < sellerReceiverIndex+1 {
		return fmt.Errorf("not enough receivers, wanted %d, got %d", sellerReceiverIndex+1, len(receivers))
	}
	seller := receivers[sellerReceiverIndex]

	// get price
	spentAmounts := e.Events["coin_spent.amount"]
	if len(spentAmounts) < priceSpentAmountIndex+1 {
		return fmt.Errorf("not enough spent amounts, wanted %d, got %d", priceSpentAmountIndex+1, len(spentAmounts))
	}
	priceAmount := spentAmounts[priceSpentAmountIndex]
	matches := amountRegexp.FindStringSubmatch(priceAmount)
	if len(matches) != 3 {
		return errors.New("failed to unmarshal price")
	}
	price := matches[1]
	denom := matches[2]

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection indexerdb.Collection
		if err := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", nftContractAddress).
			Find(&collection).
			Error; err != nil {
			return errors.Wrap(err, "collection not found")
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft price
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": nil,
			"price_denom":  nil,
			"is_listed":    false,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft price")
		}

		// create trade
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.Hash)
		if err := tx.Create(&indexerdb.Activity{
			ID:      activityID,
			Network: indexerdb.NetworkTeritori,
			NFTID:   nftID,
			Kind:    indexerdb.ActivityKindTrade,
			Time:    time.Now(), // FIXME: replace by block time
			Trade: &indexerdb.Trade{
				Price:      price,
				PriceDenom: denom,
				BuyerID:    indexerdb.TeritoriUserID(buyer),
				SellerID:   indexerdb.TeritoriUserID(seller),
			},
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create trade in db")
		}
		h.logger.Info("created trade", zap.String("id", activityID))
		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}
	return nil
}

const vaultContractSendNFTIndex = 1

type DepositNFTMsg struct {
	Amount string `json:"amount"`
	Denom  string `json:"denom"`
}

type DepositNFTHookMsg struct {
	Deposit DepositNFTMsg `json:"deposit"`
}

type SendNFTMsg struct {
	Contract string `json:"contract"`
	TokenID  string `json:"token_id"`
	Msg      []byte `json:"msg"`
}

type SendNFTExecuteMsg struct {
	SendNFT SendNFTMsg `json:"send_nft"`
}

func (h *Handler) handleExecuteSendNFT(e *Tx, contractAddress string) error {
	// get send_nft target contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < vaultContractSendNFTIndex+1 {
		return nil
	}
	txVaultContractAddress := executeContractAddresses[vaultContractSendNFTIndex]

	// check that it's the correct vault contract
	if txVaultContractAddress != vaultContractAddress {
		return nil
	}

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// get seller
	senders := e.Events["wasm.sender"]
	if len(senders) == 0 {
		return errors.New("no senders")
	}
	seller := senders[0]

	// get price from raw tx
	if len(e.Tx.Body.Messages) == 0 {
		return errors.New("no messages in tx")
	}
	txBodyMessage := e.Tx.Body.Messages[0]
	if txBodyMessage.TypeUrl != "/cosmwasm.wasm.v1.MsgExecuteContract" {
		return errors.New("invalid tx body message type")
	}
	var executeMsg wasmtypes.MsgExecuteContract
	if err := cosmosproto.Unmarshal(txBodyMessage.Value, &executeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute msg")
	}
	nftMsgBytes := executeMsg.Msg
	var nftMsg SendNFTExecuteMsg
	if err := json.Unmarshal(nftMsgBytes, &nftMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal nft execute msg")
	}
	var hookMsg DepositNFTHookMsg
	if err := json.Unmarshal(nftMsg.SendNFT.Msg, &hookMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal hook msg")
	}
	price := hookMsg.Deposit.Amount
	denom := hookMsg.Deposit.Denom

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection indexerdb.Collection
		if err := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", contractAddress).
			Find(&collection).
			Error; err != nil {
			return errors.Wrap(err, "collection not found")
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft price
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": price,
			"price_denom":  denom,
			"is_listed":    true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft")
		}

		// create listing
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.Hash)
		if err := tx.Create(&indexerdb.Activity{
			ID:      activityID,
			Network: indexerdb.NetworkTeritori,
			NFTID:   nftID,
			Kind:    indexerdb.ActivityKindList,
			Time:    time.Now(), // FIXME: replace by block time
			Listing: &indexerdb.Listing{
				Price:      price,
				PriceDenom: denom,
				SellerID:   indexerdb.TeritoriUserID(seller),
			},
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create listing in db")
		}
		h.logger.Info("created listing", zap.String("id", activityID))
		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}
	return nil
}

func (h *Handler) handleExecuteWithdraw(e *Tx, contractAddress string) error {
	// check that it's the correct vault contract
	if contractAddress != vaultContractAddress {
		return nil
	}

	// get nft contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < 2 {
		return errors.New("not enough contract addresses")
	}
	nftContractAddress := executeContractAddresses[1]

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection indexerdb.Collection
		if err := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", nftContractAddress).
			Find(&collection).
			Error; err != nil {
			return errors.Wrap(err, "collection not found")
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft price
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": nil,
			"price_denom":  nil,
			"is_listed":    false,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft")
		}

		// create cancelation
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.Hash)
		if err := tx.Create(&indexerdb.Activity{
			ID:      activityID,
			Network: indexerdb.NetworkTeritori,
			NFTID:   nftID,
			Kind:    indexerdb.ActivityKindCancelListing,
			Time:    time.Now(), // FIXME: replace by block time
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create listing cancelation in db")
		}
		h.logger.Info("created listing cancelation", zap.String("id", activityID))
		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}

	return nil
}
