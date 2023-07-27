package handlers

import (
	"encoding/hex"
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

	// NOTE: Order of case if important because  we can have multi call in same tx
	switch {
	case strings.EqualFold(tx.Info.To, h.network.RiotSquadStakingContractAddress):
		metaData = abiGo.SquadStakingV3MetaData
	// RiotNFT contract
	case strings.EqualFold(tx.Info.To, "0x7a9e5dbe7d3946ce4ea2f2396549c349635ebf2f"):
		metaData = abiGo.TeritoriNFTMetaData
	// Minter contract
	case strings.EqualFold(tx.Info.To, h.network.RiotContractAddressGen0):
		metaData = abiGo.TeritoriMinterMetaData
	case strings.EqualFold(tx.Info.To, h.network.VaultContractAddress):
		metaData = abiGo.TeritoriVaultMetaData
	case strings.EqualFold(tx.Info.To, h.network.DistributorContractAddress):
		metaData = abiGo.DistributorMetaData
	// If not matching with known handlers continue
	default:
		return nil
	}

	contractABI, err := metaData.GetAbi()
	if err != nil {
		return errors.Wrap(err, "failed to parse abi")
	}

	if tx.Info.Input == nil {
		return nil
	}

	// 60806040 is special method where tx sent to minter and it will initialize nft contract
	// we have to process it differently: we process the internal call of that tx sent to nft contract
	methodHex := hex.EncodeToString(tx.Info.Input[:4])
	if methodHex == "60806040" {
		if strings.EqualFold(tx.Info.To, h.network.RiotContractAddressGen0) {
			return h.handleInitialize(tx)
		}

		return nil
	}

	method, err := ParseMethod(contractABI, tx.Info.Input)
	if err != nil {
		return errors.Wrap(err, "failed to parse method. Tx: "+tx.Info.Hash)
	}

	args := make(map[string]interface{})
	if err := method.Inputs.UnpackIntoMap(args, []byte(tx.Info.Input[4:])); err != nil {
		return errors.Wrap(err, "failed to unpack args for "+method.Name)
	}

	h.logger.Info("method", zap.String("method", method.Name))

	switch method.Name {
	// SquadStake
	case "stake":
		if err := h.handleSquadStake(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle squad stake")
		}
	case "unstake":
		if err := h.handleSquadUnstake(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle squad unstake")
		}
	case "mintWithMetadata":
		if err := h.handleMintWithMetadata(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle mint with meta data")
		}
	case "transferFrom":
		if err := h.handleTransferFrom(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle transfer")
		}
	case "claim":
		if err := h.handleClaim(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle claim")
		}
	// Vault
	case "listNFT":
		if err := h.handleListNFT(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle listNFT")
		}
	case "withdrawNFT":
		if err := h.handleWithdrawNFT(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle withdrawNFT")
		}
	case "buyNFT":
		if err := h.handleBuyNFT(contractABI, tx, args); err != nil {
			return errors.Wrap(err, "failed to handle buyNFT")
		}
	}

	return nil
}
