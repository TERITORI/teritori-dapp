package handlers

import (
	"fmt"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerutils"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

func (h *Handler) handleSquadUnstake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	fmt.Println("unstaking ================")
	return nil
}

func (h *Handler) handleSquadStake(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var stakeInput SquadStakeInput
	if err := ArgsToStruct(args, &stakeInput); err != nil {
		return errors.Wrap(err, "failed parse squad stake input")
	}

	lastLogEntry := tx.Receipt.Logs[len(tx.Receipt.Logs)-1]

	data := new(abiGo.SquadStakingV3Stake)
	if err := contractABI.UnpackIntoInterface(data, "Stake", []byte(lastLogEntry.Data)); err != nil {
		return err
	}

	var tokenIDs []string
	var nftContracts []string

	for _, nft := range stakeInput.Nfts {
		tokenIDs = append(tokenIDs, strings.ToLower(nft.TokenId.String()))
		nftContracts = append(nftContracts, strings.ToLower(nft.Collection.String()))
	}

	indexerUtils, err := indexerutils.NewIndexerUtils(h.network.NetworkBase, h.indexerDB, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexerutils")
	}

	if err := indexerUtils.IndexSquadStake(
		"V3",
		tx.Info.To,
		tx.Info.From,
		data.StartTime.Uint64(),
		data.EndTime.Uint64(),
		tokenIDs,
		nftContracts,
	); err != nil {
		return errors.Wrap(err, "failed to index squadStake")
	}

	return nil
}
