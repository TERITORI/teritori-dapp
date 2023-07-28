package indexerhandler

import (
	"encoding/json"
	"fmt"
	"time"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/pricespb"
	"github.com/TERITORI/teritori-dapp/go/pkg/tmws"
	"github.com/allegro/bigcache/v3"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	cosmostx "github.com/cosmos/cosmos-sdk/types/tx"
	cosmosproto "github.com/cosmos/gogoproto/proto"
	"github.com/pkg/errors"
	tenderminttypes "github.com/tendermint/tendermint/rpc/core/types"
	"go.uber.org/zap"
	"golang.org/x/exp/slices"
	"gorm.io/gorm"
)

// FIXME: move contract address checks inside handlers so they can be reused

type Message struct {
	Msg          *codectypes.Any
	Height       int64
	MsgIndex     int
	MsgID        string
	TxHash       string
	Events       EventsMap
	Log          TendermintTxLog
	GetBlockTime func() (time.Time, error)
}

type Config struct {
	MinterCodeIDs    []uint64
	TendermintClient *tmws.Client
	BlockTimeCache   *bigcache.BigCache
	PricesClient     pricespb.PricesServiceClient
	Network          *networks.CosmosNetwork
	NetworkStore     networks.NetworkStore
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

func (h *Handler) HandleTendermintResultTx(tx *tenderminttypes.ResultTx) error {
	if tx.TxResult.Code != 0 {
		return nil
	}

	var logs []TendermintTxLog
	if err := json.Unmarshal([]byte(tx.TxResult.Log), &logs); err != nil {
		panic(errors.Wrap(err, "failed to parse tx log"))
	}

	var cosmosTx cosmostx.Tx
	if err := cosmosproto.Unmarshal(tx.Tx, &cosmosTx); err != nil {
		return errors.Wrap(err, "failed to unmarshal tx")
	}

	return h.HandleTx(tx.Height, tx.Hash.String(), cosmosTx, logs)
}

func (h *Handler) HandleTx(height int64, hash string, tx cosmostx.Tx, logs []TendermintTxLog) error {
	if len(logs) != len(tx.Body.Messages) {
		return errors.New("messages and results count mismatch")
	}

	var blockTime *time.Time

	codecMessages := tx.Body.Messages
	for i, codecMsg := range codecMessages {
		handlerMsg := Message{
			Msg:      codecMsg,
			MsgIndex: i,
			MsgID:    fmt.Sprintf("%s-%d", hash, i),
			Log:      logs[i],
			TxHash:   hash,
			Height:   height,
			Events:   EventsMapFromStringEvents(logs[i].Events),
			GetBlockTime: func() (time.Time, error) {
				if blockTime == nil {
					bt, err := h.blockTime(height)
					if err != nil {
						return time.Time{}, err
					}
					blockTime = &bt
				}
				return *blockTime, nil
			},
		}

		switch codecMsg.TypeUrl {
		case "/cosmwasm.wasm.v1.MsgInstantiateContract":
			if err := h.handleInstantiate(&handlerMsg); err != nil {
				return errors.Wrap(err, "failed to handle instantiate")
			}
		case "/cosmwasm.wasm.v1.MsgExecuteContract":
			if err := h.handleExecute(&handlerMsg); err != nil {
				return errors.Wrap(err, "failed to handle execute")
			}
		}
	}
	return nil
}

func (h *Handler) handleInstantiate(e *Message) error {
	var instantiateMsg wasmtypes.MsgInstantiateContract
	if err := cosmosproto.Unmarshal(e.Msg.Value, &instantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal instantiate msg")
	}

	contractAddress, err := e.Events.InstantiateContractAddress()
	if err != nil {
		return errors.Wrap(err, "failed to get outer contract address")
	}

	switch contractAddress {
	case h.config.Network.NameServiceContractAddress:
		if err := h.handleInstantiateTNS(e, contractAddress, &instantiateMsg); err != nil {
			return errors.Wrap(err, "failed to handle tns minter instantiation")
		}
		return nil
	case h.config.Network.RiotContractAddressGen1:
		if err := h.handleInstantiateBreeding(e, contractAddress, &instantiateMsg); err != nil {
			return errors.Wrap(err, "failed to handle breeding instantiation")
		}
		return nil
	}

	if slices.Contains(h.config.MinterCodeIDs, instantiateMsg.CodeID) {
		if err := h.handleInstantiateBunker(e, contractAddress, &instantiateMsg); err != nil {
			return errors.Wrap(err, "failed to handle minter instantiation")
		}
		return nil
	}

	h.logger.Debug("ignored instantiate with unknown code id", zap.Uint64("value", instantiateMsg.CodeID))
	return nil
}

type ExecutePayload map[string]json.RawMessage

func (h *Handler) handleExecute(e *Message) error {
	var executeMsg wasmtypes.MsgExecuteContract
	if err := cosmosproto.Unmarshal(e.Msg.Value, &executeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute msg")
	}

	var payload ExecutePayload
	if err := json.Unmarshal(executeMsg.Msg, &payload); err != nil {
		h.logger.Error("failed to unmarshal execute payload", zap.Error(err))
		return nil
	}
	if len(payload) != 1 {
		h.logger.Error("unexpected execute keys count", zap.Int("count", len(payload)))
		return nil
	}
	wasmAction := ""
	for key := range payload {
		wasmAction = key
	}

	h.logger.Debug("wasm", zap.String("action", wasmAction), zap.String("contract", executeMsg.Contract), zap.Int64("height", e.Height))

	switch wasmAction {
	case "mint":
		if err := h.handleExecuteMint(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle mint")
		}
	case "buy":
		if err := h.handleExecuteBuy(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle buy")
		}
	case "send_nft":
		if err := h.handleExecuteSendNFT(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle send_nft")
		}
	case "withdraw":
		// Squad unstaking
		if executeMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV1 || executeMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV2 {
			if err := h.handleExecuteSquadUnstake(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle squad unstake")
			}
		} else {
			if err := h.handleExecuteWithdraw(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle withdraw")
			}
		}
	case "burn":
		if err := h.handleExecuteBurn(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle burn")
		}
	case "update_price":
		if err := h.handleExecuteUpdatePrice(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle update_price")
		}
	case "transfer_nft":
		if err := h.handleExecuteTransferNFT(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle transfer_nft")
		}
	case "update_metadata":
		if err := h.handleExecuteUpdateTNSMetadata(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle update_metadata")
		}
	case "set_admin_address":
		if err := h.handleExecuteTNSSetAdminAddress(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle set_admin_address")
		}
	case "update_config":
		if err := h.handleExecuteBunkerUpdateConfig(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle update_config")
		}
	case "pause":
		if err := h.handleExecuteBunkerPause(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle pause")
		}
	case "unpause":
		if err := h.handleExecuteBunkerUnpause(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle unpause")
		}
	case "stake":
		if executeMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV1 || executeMsg.Contract == h.config.Network.RiotSquadStakingContractAddressV2 {
			if err := h.handleExecuteSquadStake(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle squad stake")
			}
		}
	// Feeds actions
	case "create_post":
		if err := h.handleExecuteCreatePost(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle create post")
		}
	case "create_post_by_bot":
		if executeMsg.Contract == h.config.Network.SocialFeedContractAddress {
			if err := h.handleExecuteCreatePostByBot(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle create post by bot")
			}
		}
	case "tip_post":
		if executeMsg.Contract == h.config.Network.SocialFeedContractAddress {
			if err := h.handleExecuteTipPost(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle tip post")
			}
		}
	case "react_post":
		if executeMsg.Contract == h.config.Network.SocialFeedContractAddress {
			if err := h.handleExecuteReactPost(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle react post")
			}
		}
	case "delete_post":
		if executeMsg.Contract == h.config.Network.SocialFeedContractAddress {
			if err := h.handleExecuteDeletePost(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle delete post")
			}
		}
	// Orgs actions
	case "instantiate_contract_with_self_admin":
		if err := h.handleExecuteInstantiateContractWithSelfAdmin(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle instantiate_contract_with_self_admin")
		}
	case "propose":
		if err := h.handleExecuteDAOPropose(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle dao execute")
		}
	case "execute":
		if err := h.handleExecuteDAOExecute(e, &executeMsg); err != nil {
			return errors.Wrap(err, "failed to handle dao execute")
		}
	// Video actions
	case "create_video":
		if executeMsg.Contract == h.config.Network.VideoContractAddress {
			if err := h.handleExecuteCreateVideo(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle create video execute")
			}
		}
	case "delete_video":
		if executeMsg.Contract == h.config.Network.VideoContractAddress {
			if err := h.handleExecuteDeleteVideo(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle delete video execute")
			}
		}
	case "add_to_library":
		if executeMsg.Contract == h.config.Network.VideoContractAddress {
			if err := h.handleExecuteAddToLibrary(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle add to library execute")
			}
		}
	case "remove_from_library":
		if executeMsg.Contract == h.config.Network.VideoContractAddress {
			if err := h.handleExecuteRemoveFromLibrary(e, &executeMsg); err != nil {
				return errors.Wrap(err, "failed to handle remove from library execute")
			}
		}
	}

	return nil
}

func (h *Handler) handleExecuteMint(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract

	var collections []*indexerdb.Collection
	if err := h.db.Preload("TeritoriCollection").Limit(1).Find(&collections, &indexerdb.Collection{ID: h.config.Network.CollectionID(contractAddress)}).Error; err != nil {
		return errors.Wrap(err, "find collection error")
	}
	if len(collections) == 0 {
		h.logger.Debug("ignored mint from unknown collection", zap.String("address", contractAddress))
		return nil
	}
	collection := collections[0]
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info in collection")
	}

	// FIXME: do message analysis instead of events

	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	if collection.TeritoriCollection != nil && collection.TeritoriCollection.MintContractAddress == h.config.Network.NameServiceContractAddress {
		if err := h.handleExecuteMintTNS(e, collection, tokenId, execMsg); err != nil {
			return errors.Wrap(err, "failed to handle tns mint")
		}
		return nil
	}

	if err := h.handleExecuteMintBunker(e, collection, tokenId, execMsg); err != nil {
		return errors.Wrap(err, "failed to handle classic mint")
	}

	return nil
}
