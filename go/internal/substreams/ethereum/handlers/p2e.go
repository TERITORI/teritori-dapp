package handlers

import (
	"math/big"
	"strconv"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"

	"github.com/TERITORI/teritori-dapp/go/internal/indexeraction"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

type ClaimInput struct {
	Token      common.Address `json:"token"`
	Allocation *big.Int       `json:"allocation"`
	Proofs     [][32]byte     `json:"proofs"`
}

func (h *Handler) handleClaim(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	caller := tx.Info.From

	var input ClaimInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse claim input")
	}

	var totalClaimed = indexerdb.P2eTotalClaimed{
		UserID:    h.network.UserID(caller),
		NetworkID: h.network.NetworkBase.ID,
	}
	if err := h.dbTransaction.FirstOrCreate(&totalClaimed).Error; err != nil {
		return errors.Wrap(err, "failed to get total claimed")
	}

	var amount *big.Int
	if totalClaimed.Amount == "" {
		amount = big.NewInt(0)
	} else {
		amount = new(big.Int)
		if _, ok := amount.SetString(totalClaimed.Amount, 10); !ok {
			return errors.New("failed to get current claimed amount")
		}
	}

	totalClaimed.Amount = amount.Add(amount, input.Allocation).String()

	if err := h.dbTransaction.Save(&totalClaimed).Error; err != nil {
		return errors.New("failed to update claimed amount")
	}

	return nil
}

func (h *Handler) handleSquadUnstake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	totalLogs := len(tx.Receipt.Logs)
	var tokenIDs []string
	var nftContracts []string

	var shifted int
	if h.network.ID == "polygon" || h.network.ID == "polygon-mumbai" {
		shifted = 2
	} else {
		shifted = 1
	}

	// TODO: find a way to decode topics with go ABI
	for _, log := range tx.Receipt.Logs[:totalLogs-shifted] {
		tokenID, err := DecodeTopicToInt(log.Topics[3])

		if err != nil {
			return errors.Wrap(err, "failed to parsed event log")
		}

		tokenIDs = append(tokenIDs, strconv.FormatInt(int64(tokenID), 10))
		nftContracts = append(nftContracts, log.Address)
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.SquadUnstake(
		tx.Info.To,
		tx.Info.From,
		tokenIDs,
		nftContracts,
	); err != nil {
		return errors.Wrap(err, "failed to index squadUnStake")
	}

	return nil
}

func (h *Handler) handleSquadStake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var stakeInput SquadStakeInput
	if err := ArgsToStruct(args, &stakeInput); err != nil {
		return errors.Wrap(err, "failed parse squad stake input")
	}

	var stakeLogEntry *pb.Log

	for _, log := range tx.Receipt.Logs {
		if log.Address == h.network.RiotSquadStakingContractAddress {
			stakeLogEntry = log
		}
	}

	if stakeLogEntry == nil {
		return errors.New("failed to get stake log entry")
	}

	squadStakeEvent := new(abiGo.SquadStakingV3Stake)
	if err := contractABI.UnpackIntoInterface(squadStakeEvent, "Stake", []byte(stakeLogEntry.Data)); err != nil {
		return err
	}

	var tokenIDs []string
	var nftContracts []string

	for _, nft := range stakeInput.Nfts {
		tokenIDs = append(tokenIDs, strings.ToLower(nft.TokenId.String()))
		nftContracts = append(nftContracts, strings.ToLower(nft.Collection.String()))
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.SquadStake(
		"V3",
		tx.Info.To,
		tx.Info.From,
		squadStakeEvent.StartTime.Uint64(),
		squadStakeEvent.EndTime.Uint64(),
		tokenIDs,
		nftContracts,
	); err != nil {
		return errors.Wrap(err, "failed to index squadStake")
	}

	return nil
}
