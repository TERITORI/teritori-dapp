package handlers

import (
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/pkg/errors"
)

type ExecuteInput struct {
	CommandId     [32]byte `json:"commandId"`
	SourceChain   string   `json:"sourceChain"`
	SourceAddress string   `json:"sourceAddress"`
	Payload       []byte   `json:"payload"`
}

func (h *Handler) handleExecute(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var input ExecuteInput
	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse transfer input")
	}

	tokenID, err := DecodeTopicToInt(tx.Receipt.Logs[1].Data)
	if err != nil {
		return errors.Wrap(err, "failed to decode tokenID")
	}

	to := tx.Info.To
	bridge := input.SourceAddress

	fmt.Println("to", to)
	fmt.Println("bridge", bridge)
	fmt.Println("tokenID", tokenID)

	return nil
}
