package handlers

import (
	"fmt"
	"time"

	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/pb"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
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

	startTimeDt := time.Unix(data.StartTime.Int64(), 0)
	// endTimeDt := time.Unix(data.EndTime.Int64(), 0)
	season, _, err := p2e.GetSeasonByTime(startTimeDt)
	if err != nil {
		return errors.Wrap(err, "failed to get season")
	}

	fmt.Println(season)

	return nil
}
