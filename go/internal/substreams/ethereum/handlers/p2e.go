package handlers

import (
	"encoding/json"

	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/ethereum/go-ethereum/accounts/abi"

	"github.com/pkg/errors"
)

type SquadStakeInput struct {
	Nfts []abiGo.SquadStakingV3NftInfo `json:"nfts"`
}

func HandleSquadStake(method *abi.Method, data []byte) error {
	jsonStr, err := InputsToJson(method, data)
	if err != nil {
		return errors.Wrap(err, "failed to decode input")
	}

	var input SquadStakeInput
	if err := json.Unmarshal(jsonStr, &input); err != nil {
		return errors.Wrap(err, "failed to decode data")
	}

	return nil
}
