package p2e

import (
	"math/big"

	"github.com/TERITORI/teritori-dapp/go/pkg/merkletree"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

var (
	AddressType, _ = abi.NewType("address", "address", nil)
	Uint256Type, _ = abi.NewType("uint256", "uint256", nil)
)

type RewardData struct {
	To     common.Address
	Token  common.Address
	Amount *big.Int
}

// CalculateHash hashes the values of a TestContent
func (d RewardData) CalculateHash() ([]byte, error) {
	args := abi.Arguments{
		{
			Type: AddressType,
		},
		{
			Type: AddressType,
		},
		{
			Type: Uint256Type,
		},
	}

	packedData, err := args.Pack(
		d.To,
		d.Token,
		d.Amount,
	)

	if err != nil {
		return nil, err
	}

	hash := crypto.Keccak256(packedData)
	return hash, nil
}

// Equals tests for equality of two Contents
func (d RewardData) Equals(other merkletree.Content) (bool, error) {
	to := other.(RewardData).To
	token := other.(RewardData).Token
	amount := other.(RewardData).Amount

	return to == d.To && token == d.Token && amount.String() == d.Amount.String(), nil
}
