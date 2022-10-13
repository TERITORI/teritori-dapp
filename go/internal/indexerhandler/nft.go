package indexerhandler

import (
	"encoding/json"
	"time"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	cosmosproto "github.com/cosmos/gogoproto/proto"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

const vaultContractSendNFTIndex = 1

type DepositNFTMsg struct {
	Amount string `json:"amount"`
	Denom  string `json:"denom"`
}

type DepositNFTHookMsg struct {
	Deposit DepositNFTMsg `json:"deposit"`
}

type SendNFTMsg struct {
	Contract string `json:"contract"`
	TokenID  string `json:"token_id"`
	Msg      []byte `json:"msg"`
}

type SendNFTExecuteMsg struct {
	SendNFT SendNFTMsg `json:"send_nft"`
}

func (h *Handler) handleExecuteSendNFT(e *Tx, contractAddress string) error {
	// get send_nft target contract address
	executeContractAddresses := e.Events["execute._contract_address"]
	if len(executeContractAddresses) < vaultContractSendNFTIndex+1 {
		return nil
	}
	txVaultContractAddress := executeContractAddresses[vaultContractSendNFTIndex]

	// check that it's the correct vault contract
	if txVaultContractAddress != h.config.VaultContractAddress {
		return nil
	}

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// get seller
	senders := e.Events["wasm.sender"]
	if len(senders) == 0 {
		return errors.New("no senders")
	}
	seller := senders[0]

	// get price from raw tx
	// FIXME: dedup
	if len(e.Tx.Body.Messages) == 0 {
		return errors.New("no messages in tx")
	}
	txBodyMessage := e.Tx.Body.Messages[0]
	if txBodyMessage.TypeUrl != "/cosmwasm.wasm.v1.MsgExecuteContract" {
		return errors.New("invalid tx body message type")
	}
	var executeMsg wasmtypes.MsgExecuteContract
	if err := cosmosproto.Unmarshal(txBodyMessage.Value, &executeMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute msg")
	}
	nftMsgBytes := executeMsg.Msg
	var nftMsg SendNFTExecuteMsg
	if err := json.Unmarshal(nftMsgBytes, &nftMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal nft execute msg")
	}
	var hookMsg DepositNFTHookMsg
	if err := json.Unmarshal(nftMsg.SendNFT.Msg, &hookMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal hook msg")
	}
	price := hookMsg.Deposit.Amount
	denom := hookMsg.Deposit.Denom

	if err := h.db.Transaction(func(tx *gorm.DB) error {
		// find nft id
		var collection *indexerdb.Collection
		findResult := tx.
			Joins("TeritoriCollection").
			Where("TeritoriCollection__nft_contract_address = ?", contractAddress).
			Find(&collection)
		if err := findResult.
			Error; err != nil {
			return errors.Wrap(err, "failed to query collection")
		}
		if findResult.RowsAffected == 0 {
			h.logger.Debug("ignored send_nft on unknown collection")
			return nil
		}
		if collection.TeritoriCollection == nil {
			return errors.New("no teritori info on collection")
		}
		nftID := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

		// update nft price
		if err := tx.Model(&indexerdb.NFT{}).Where("id = ?", nftID).Updates(map[string]interface{}{
			"price_amount": price,
			"price_denom":  denom,
			"is_listed":    true,
		}).Error; err != nil {
			return errors.Wrap(err, "failed to update nft")
		}

		// create listing
		var nft indexerdb.NFT
		if err := tx.Find(&nft, &indexerdb.NFT{ID: nftID}).Error; err != nil {
			return errors.Wrap(err, "nft not found in db")
		}
		activityID := indexerdb.TeritoriActiviyID(e.Hash)
		if err := tx.Create(&indexerdb.Activity{
			ID:    activityID,
			NFTID: nftID,
			Kind:  indexerdb.ActivityKindList,
			Time:  time.Now(), // FIXME: replace by block time
			Listing: &indexerdb.Listing{
				Price:      price,
				PriceDenom: denom,
				SellerID:   indexerdb.TeritoriUserID(seller),
			},
		}).Error; err != nil {
			return errors.Wrap(err, "failed to create listing in db")
		}
		h.logger.Info("created listing", zap.String("id", activityID))
		return nil
	}); err != nil {
		return errors.Wrap(err, "db tx failed")
	}
	return nil
}

func (h *Handler) handleExecuteBurn(e *Tx, contractAddress string) error {
	// get collection
	var collection indexerdb.Collection
	r := h.db.
		Joins("TeritoriCollection").
		Where("TeritoriCollection__nft_contract_address = ?", contractAddress).
		Find(&collection)
	if err := r.
		Error; err != nil {
		return errors.Wrap(err, "failed to query collections")
	}
	if r.RowsAffected == 0 {
		h.logger.Debug("ignored burn on unknown collection", zap.String("contract-address", contractAddress))
		return nil
	}
	if collection.TeritoriCollection == nil {
		return errors.New("no teritori info on collection")
	}

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// delete
	nftId := indexerdb.TeritoriNFTID(collection.TeritoriCollection.MintContractAddress, tokenId)
	if err := h.db.Delete(&indexerdb.NFT{ID: nftId}).Error; err != nil {
		return errors.Wrap(err, "failed to delete nft")
	}

	// TODO: create burn activity

	h.logger.Debug("burnt nft", zap.String("id", nftId))

	return nil
}
