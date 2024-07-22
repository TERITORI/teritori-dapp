package handlers

import (
	"bytes"
	"encoding/hex"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
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
	indexerMode   indexerdb.IndexerMode
}

type HandlerConfig struct {
	Logger        *zap.Logger
	Network       *networks.EthereumNetwork
	NetworkStore  *networks.NetworkStore
	IndexerDB     *gorm.DB
	DbTransaction *gorm.DB
	IndexerMode   indexerdb.IndexerMode
}

func NewHandler(handlerConfig *HandlerConfig) (*Handler, error) {
	return &Handler{
		logger:        handlerConfig.Logger,
		network:       handlerConfig.Network,
		networkStore:  handlerConfig.NetworkStore,
		indexerDB:     handlerConfig.IndexerDB,
		dbTransaction: handlerConfig.DbTransaction,
		indexerMode:   handlerConfig.IndexerMode,
	}, nil
}

var transferTopic = HashTopic("Transfer(address,address,uint256)")

func (h *Handler) HandleETHTx(tx *pb.Tx) error {
	var metaData *bind.MetaData

	// NOTE: Order of case if important because  we can have multi call in same tx
	switch {
	case strings.EqualFold(tx.Info.To, h.network.RiotSquadStakingContractAddress):
		metaData = abiGo.SquadStakingV3MetaData
	case strings.EqualFold(tx.Info.To, h.network.RiotBridgedNFTAddressGen0), strings.EqualFold(tx.Info.To, h.network.RiotBridgedNFTAddressGen1):
		metaData = abiGo.TeritoriNFTAxelarMetaData
	// RiotNFT contract
	case strings.EqualFold(tx.Info.To, h.network.RiotNFTAddressGen0), strings.EqualFold(tx.Info.To, h.network.RiotNFTAddressGen1):
		metaData = abiGo.TeritoriNFTMetaData
	// Minter contract
	case strings.EqualFold(tx.Info.To, h.network.RiotContractAddressGen0):
		metaData = abiGo.TeritoriMinterMetaData
	case strings.EqualFold(tx.Info.To, h.network.VaultContractAddress):
		metaData = abiGo.TeritoriVaultMetaData
	case strings.EqualFold(tx.Info.To, h.network.DistributorContractAddress):
		metaData = abiGo.DistributorMetaData
	// Bridge
	case strings.EqualFold(tx.Info.To, h.network.RiotBridgeAddressGen0), strings.EqualFold(tx.Info.To, h.network.RiotBridgeAddressGen1):
		metaData = abiGo.AxelarBridgeETHMetaData
	// If the tx is not related to our contract then try to detect if there is nft transfer in the tx
	default:
		for _, log := range tx.Receipt.Logs {
			if strings.EqualFold(log.Address, h.network.RiotNFTAddressGen0) {
				if !bytes.Equal(log.Topics[0], transferTopic) {
					return nil
				}
				from := DecodeTopicToAddr(log.Topics[1])
				to := DecodeTopicToAddr(log.Topics[2])
				nftID, err := DecodeTopicToInt(log.Topics[3])
				if err != nil {
					return errors.Wrap(err, "failed to decode tokenID")
				}

				if err := h.handleTransfer(tx, log.Address, from, to, nftID); err != nil {
					return errors.Wrap(err, "failed to handle transfer")
				}
			}
		}
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
	if methodHex == "60806040" || methodHex == "60c06040" || methodHex == "60a06040" || methodHex == "a6487c53" {
		if strings.EqualFold(tx.Info.To, h.network.RiotContractAddressGen0) {
			return h.handleInitialize(tx)
		}

		return nil
	}

	// Ignore requestMint
	if methodHex == "31a02bce" {
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

	if h.indexerMode == indexerdb.IndexerModeP2E {
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
		case "claim":
			if err := h.handleClaim(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle claim")
			}
		}
	}

	if h.indexerMode == indexerdb.IndexerModeData {
		switch method.Name {
		// Axelar NFT
		case "execute":
			if err := h.handleExecute(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle execute axelar NFT")
			}
		// Minter
		case "setNft":
			if err := h.handleSetNft(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle setNft")
			}
		case "bridgeNft":
			if err := h.handleBridgeNFT(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle execute bridge NFT")
			}
		case "mint", "mintWithMetadata":
			if err := h.handleMintWithMetadata(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle mint and mint with meta data")
			}
		case "transferFrom", "safeTransferFrom":
			if err := h.handleTransferFrom(contractABI, tx, args); err != nil {
				return errors.Wrap(err, "failed to handle transfer")
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
		default:
			h.logger.Info(">>> ignore", zap.String("method", method.Name))
		}
	}

	return nil
}
