package handlers

import (
	"strings"

	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type Handler struct {
	logger        *zap.Logger
	network       *networks.EthereumNetwork
	networkStore  *networks.NetworkStore
	indexerDB     *gorm.DB
	dbTransaction *gorm.DB
}

type HandlerConfig struct {
	Logger        *zap.Logger
	Network       *networks.EthereumNetwork
	NetworkStore  *networks.NetworkStore
	IndexerDB     *gorm.DB
	DbTransaction *gorm.DB
}

func NewHandler(handlerConfig *HandlerConfig) (*Handler, error) {
	return &Handler{
		logger:        handlerConfig.Logger,
		network:       handlerConfig.Network,
		networkStore:  handlerConfig.NetworkStore,
		indexerDB:     handlerConfig.IndexerDB,
		dbTransaction: handlerConfig.DbTransaction,
	}, nil
}

func (h *Handler) HandleETHTx(tx *pb.Tx) error {
	var metaData *bind.MetaData

	switch {
	case strings.EqualFold(tx.Info.To, h.network.RiotSquadStakingContractAddress):
		metaData = abiGo.SquadStakingV3MetaData
	// RiotNFT contract
	case strings.EqualFold(tx.Info.To, "0x7a9e5dbe7d3946ce4ea2f2396549c349635ebf2f"):
		metaData = abiGo.TeritoriNFTMetaData
	// Minter contract
	case strings.EqualFold(tx.Info.To, "0x43cc70bf324d716782628bed38af97e4afe92f69"):
		metaData = abiGo.TeritoriMinterMetaData
	}

	contractABI, err := metaData.GetAbi()
	if err != nil {
		return errors.Wrap(err, "failed to parse abi")
	}

	if tx.Info.Input == nil {
		return nil
	}

	method, err := ParseMethod(contractABI, tx.Info.Input)
	if err != nil {
		return errors.Wrap(err, "failed to parse method")
	}

	args := make(map[string]interface{})
	if err := method.Inputs.UnpackIntoMap(args, []byte(tx.Info.Input[4:])); err != nil {
		return errors.Wrap(err, "failed to unpack args for "+method.Name)
	}

	h.logger.Info("method", zap.String("method", method.Name))

	switch method.Name {
	case "stake":
		if err := h.handleSquadStake(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle squad stake")
		}
	case "unstake":
		if err := h.handleSquadUnstake(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle squad unstake")
		}
	case "initialize":
		if err := h.handleInitialize(method, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle initialize")
		}
	case "mintWithMetadata":
		if err := h.handleMintWithMetadata(method, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle mint with meta data")
		}
	case "transferFrom":
		if err := h.handleTransferFrom(method, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle transfer")
		}
	}

	return nil
}
