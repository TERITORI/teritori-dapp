package indexerhandler

import (
	"encoding/json"

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

type Tx struct {
	Hash   string
	Tx     *cosmostx.Tx
	Events EventsMap
}

type Config struct {
	TNSContractAddress   string
	RESTEndpoint         string
	MinterCodeID         string
	VaultContractAddress string
	TNSDefaultImageURL   string
}

type Handler struct {
	db *gorm.DB

	logger *zap.Logger
	config Config
}

func NewHandler(db *gorm.DB, config Config, logger *zap.Logger) (*Handler, error) {
	if db == nil {
		return nil, errors.New("nil db")
	}
	if logger == nil {
		logger = zap.NewNop()
	}
	return &Handler{
		db:     db,
		logger: logger,
		config: config,
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

// FIXME: handle message by message instead of the tx bundle

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

	switch contractAddress {
	case h.config.TNSContractAddress:
		if err := h.handleInstantiateTNS(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle tns minter instantiation")
		}
		return nil
	}

	switch codeId {
	case h.config.MinterCodeID:
		if err := h.handleInstantiateMinter(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle minter instantiation")
		}
	default:
		h.logger.Debug("ignored instantiate with unknown code id", zap.String("value", codeId))
	}

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
	case "burn":
		if err := h.handleExecuteBurn(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle burn")
		}
	case "update_price":
		if err := h.handleExecuteUpdatePrice(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle burn")
		}
	case "update_metadata":
		if err := h.handleExecuteUpdateMetadata(e, contractAddress); err != nil {
			return errors.Wrap(err, "failed to handle burn")
		}
	}

	return nil
}

func (h *Handler) handleExecuteMint(e *Tx, contractAddress string) error {
	var collections []*indexerdb.Collection
	if err := h.db.Preload("TeritoriCollection").Limit(1).Find(&collections, &indexerdb.Collection{ID: indexerdb.TeritoriCollectionID(contractAddress)}).Error; err != nil {
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

	if collection.TeritoriCollection != nil && collection.TeritoriCollection.MintContractAddress == h.config.TNSContractAddress {
		if err := h.handleExecuteMintTNS(e, collection, tokenId); err != nil {
			return errors.Wrap(err, "failed to handle tns mint")
		}
		return nil
	}

	if err := h.handleExecuteMintClassic(e, collection, tokenId); err != nil {
		return errors.Wrap(err, "failed to handle classic mint")
	}

	return nil
}
