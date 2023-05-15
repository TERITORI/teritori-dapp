package handlers

import (
	"math/big"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexeraction"
	abiGo "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/abi_go"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

type ListNFTInput struct {
	Nft        common.Address           `json:"nft"`
	TokenId    *big.Int                 `json:"tokenId"`
	SaleOption abiGo.NFTVaultSaleOption `json:"saleOption"`
}

type WithdrawNFTInput struct {
	Nft     common.Address `json:"nft"`
	TokenId *big.Int       `json:"tokenId"`
}

type BuyNFTInput struct {
	Nft     common.Address `json:"nft"`
	TokenId *big.Int       `json:"tokenId"`
}

func (h *Handler) handleBuyNFT(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var input BuyNFTInput

	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse buyNFT input")
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.BuyNFT(
		tx.Info.From,
		input.Nft.String(),
		input.TokenId.String(),
		tx.Info.Hash,
		int(tx.Receipt.Logs[0].Index),
		time.Unix(int64(tx.Clock.Timestamp), 0),
	); err != nil {
		return errors.Wrap(err, "failed to index withdrawNFT")
	}

	return nil
}

func (h *Handler) handleWithdrawNFT(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var input WithdrawNFTInput

	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse withdrawNFT input")
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.WithdrawNFT(
		tx.Info.From,
		input.Nft.String(),
		input.TokenId.String(),
		tx.Info.Hash,
		int(tx.Receipt.Logs[1].Index),
		time.Unix(int64(tx.Clock.Timestamp), 0),
	); err != nil {
		return errors.Wrap(err, "failed to index withdrawNFT")
	}

	return nil
}

func (h *Handler) handleListNFT(contractABI *abi.ABI, tx *pb.Tx, args map[string]interface{}) error {
	var input ListNFTInput

	if err := ArgsToStruct(args, &input); err != nil {
		return errors.Wrap(err, "failed to parse listNFT input")
	}

	indexerAction, err := indexeraction.NewIndexerAction(h.network.NetworkBase, h.dbTransaction, h.logger)
	if err != nil {
		return errors.Wrap(err, "failed to get indexeraction")
	}

	if err := indexerAction.ListNFT(
		tx.Info.From,
		input.Nft.String(),
		input.TokenId.String(),
		input.SaleOption.Token.String(),
		input.SaleOption.Amount.String(),
		tx.Info.Hash,
		int(tx.Receipt.Logs[0].Index),
		time.Unix(int64(tx.Clock.Timestamp), 0),
	); err != nil {
		return errors.Wrap(err, "failed to index listNFT")
	}

	return nil
}
