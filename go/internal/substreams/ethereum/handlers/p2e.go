package handlers

import (
	"strconv"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexeraction"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

func (h *Handler) handleSquadUnstake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	totalLogs := len(tx.Receipt.Logs)
	var tokenIDs []string
	var nftContracts []string

	// TODO: find a way to decode topics with go ABI
	for _, log := range tx.Receipt.Logs[:totalLogs-1] {
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
		return errors.Wrap(err, "failed to index squadStake")
	}

	return nil
}

func (h *Handler) handleSquadStake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var stakeInput SquadStakeInput
	if err := ArgsToStruct(args, &stakeInput); err != nil {
		return errors.Wrap(err, "failed parse squad stake input")
	}

	lastLogEntry := tx.Receipt.Logs[len(tx.Receipt.Logs)-1]

	squadStakeEvent := new(abiGo.SquadStakingV3Stake)
	if err := contractABI.UnpackIntoInterface(squadStakeEvent, "Stake", []byte(lastLogEntry.Data)); err != nil {
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
