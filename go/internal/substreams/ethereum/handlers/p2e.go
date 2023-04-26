package handlers

import (
	"encoding/json"

	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"

	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

func HandleSquadStake(method *abi.Method, tx *pb.Tx) error {
	jsonStr, err := InputsToJson(method, tx.Call.Input)
	if err != nil {
		return errors.Wrap(err, "failed to decode input")
	}

	var input SquadStakeInput
	if err := json.Unmarshal(jsonStr, &input); err != nil {
		return errors.Wrap(err, "failed to decode data")
	}

	// startTimeDt := time.Unix(int64(tnxData.Timestamp), 0)
	// season, _, err := p2e.GetSeasonByTime(startTimeDt)
	// if err != nil {
	// 	return errors.Wrap(err, "failed to get season")
	// }

	return nil
}
