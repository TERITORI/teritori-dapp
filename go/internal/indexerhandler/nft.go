package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

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
	Data SendNFTMsg `json:"send_nft"`
}

func (h *Handler) handleExecuteSendNFT(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// get inner msg
	var sendNFTMsg SendNFTExecuteMsg
	if err := json.Unmarshal(execMsg.Msg, &sendNFTMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal nft execute msg")
	}

	// vault
	if sendNFTMsg.Data.Contract == h.config.Network.VaultContractAddress {
		if err := h.handleExecuteSendNFTVault(e, execMsg, &sendNFTMsg); err != nil {
			return errors.Wrap(err, "failed to handle vault listing")
		}
		return nil
	}

	// fallback
	if err := h.handleExecuteSendNFTFallback(e, execMsg, &sendNFTMsg); err != nil {
		return errors.Wrap(err, "failed to handle fallback send_nft")
	}
	return nil
}

func (h *Handler) handleExecuteSendNFTFallback(e *Message, execMsg *wasmtypes.MsgExecuteContract, sendNFTMsg *SendNFTExecuteMsg) error {
	// get token id
	tokenId := sendNFTMsg.Data.TokenID

	// find nft id
	var collection *indexerdb.Collection
	findResult := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN Teritori_collections ON Teritori_collections.collection_id = collections.id").
		Where("Teritori_collections.nft_contract_address = ?", execMsg.Contract).
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
	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)

	senderID := h.config.Network.UserID(execMsg.Sender)
	receiverID := h.config.Network.UserID(sendNFTMsg.Data.Contract)

	// update owner in db
	if err := h.db.Model(&indexerdb.NFT{ID: nftId}).UpdateColumn("owner_id", receiverID).Error; err != nil {
		return errors.Wrap(err, "failed to updated owner in db")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create send activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindSendNFT,
		Time: blockTime,
		SendNFT: &indexerdb.SendNFT{
			Sender:   senderID,
			Receiver: receiverID,
		},
		NFTID: nftId,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create mint activity")
	}

	return nil
}

func (h *Handler) handleExecuteBurn(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract

	// get collection
	var collection indexerdb.Collection
	r := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN Teritori_collections ON Teritori_collections.collection_id = collections.id").
		Where("Teritori_collections.nft_contract_address = ?", contractAddress).
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

	// FIXME: analyze exec msg

	// get token id
	tokenIds := e.Events["wasm.token_id"]
	if len(tokenIds) == 0 {
		return errors.New("no token ids")
	}
	tokenId := tokenIds[0]

	// delete
	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, tokenId)
	if err := h.db.Model(&indexerdb.NFT{}).Where(&indexerdb.NFT{ID: nftId}).UpdateColumn("burnt", true).Error; err != nil {
		return errors.Wrap(err, "failed to delete nft")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindBurn,
		Time: blockTime,
		Burn: &indexerdb.Burn{
			BurnerID: h.config.Network.UserID(execMsg.Sender),
		},
		NFTID: nftId,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create burn activity")
	}

	h.logger.Debug("burnt nft", zap.String("id", string(nftId)))

	return nil
}

type TransferNftMsg struct {
	Recipient string `json:"recipient"`
	TokenID   string `json:"token_id"`
}

type ExecuteTransferNftMsg struct {
	Data TransferNftMsg `json:"transfer_nft"`
}

func (h *Handler) handleExecuteTransferNFT(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract

	// get collection
	var collection indexerdb.Collection
	r := h.db.
		Preload("TeritoriCollection").
		Joins("JOIN Teritori_collections ON Teritori_collections.collection_id = collections.id").
		Where("Teritori_collections.nft_contract_address = ?", contractAddress).
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

	// get msg
	var msg ExecuteTransferNftMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to un marshal msg")
	}

	receiverID := h.config.Network.UserID(msg.Data.Recipient)

	// update owner in db
	nftId := h.config.Network.NFTID(collection.TeritoriCollection.MintContractAddress, msg.Data.TokenID)
	if err := h.db.Model(&indexerdb.NFT{ID: nftId}).UpdateColumn("owner_id", receiverID).Error; err != nil {
		return errors.Wrap(err, "failed to updated owner in db")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	// create transfer activity
	if err := h.db.Create(&indexerdb.Activity{
		ID:   h.config.Network.ActivityID(e.TxHash, e.MsgIndex),
		Kind: indexerdb.ActivityKindTransferNFT,
		Time: blockTime,
		TransferNFT: &indexerdb.TransferNFT{
			Sender:   h.config.Network.UserID(execMsg.Sender),
			Receiver: receiverID,
		},
		NFTID: nftId,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create transfer activity")
	}

	h.logger.Debug("transfered nft", zap.String("id", string(nftId)))

	return nil
}
