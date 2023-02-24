package indexerhandler

import (
	"encoding/json"
	"strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type SellerRegisterMsg struct {
	Seller        string `json:"seller"`
	SellerId      string `json:"seller_id"`
	SellerInfoUrl string `json:"seller_info_url"`
}

func (h *Handler) handleExecuteRegisterSeller(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.SellerContractAddress {
		return nil
	}
	var msg SellerRegisterMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal register_seller msg")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	//create seller
	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)
	if err := h.db.Create(&indexerdb.Seller{
		SellerId:      seller_id,
		SellerAddress: msg.Seller,
		InfoUrl:       msg.SellerInfoUrl,
		Time:          blockTime,
		IsActive:      false,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create seller activity")
	}
	return nil
}

type SellerUpdateActiveMsg struct {
	SellerId string `json:"seller_id"`
	IsActive string `json:"is_active"`
}

func (h *Handler) handleExecuteSellerActive(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.SellerContractAddress {
		return nil
	}
	var msg SellerUpdateActiveMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal update_seller_active msg")
	}

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	//update seller
	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)
	is_active, _ := strconv.ParseBool(msg.IsActive)

	if err := h.db.Model(&indexerdb.Seller{}).Where("seller_id = ?", seller_id).UpdateColumns(indexerdb.Seller{IsActive: is_active, Time: blockTime}).Error; err != nil {
		return errors.Wrap(err, "failed to update seller active")
	}
	return nil
}

type SellerUpdateSellerMsg struct {
	SellerId      string `json:"seller_id"`
	SellerInfoUrl string `json:"seller_info_url"`
}

func (h *Handler) handleExecuteUpdateSeller(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.SellerContractAddress {
		return nil
	}
	var msg SellerUpdateSellerMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal update_seller msg")
	}

	//update seller
	seller_id, _ := strconv.ParseUint(msg.SellerId, 10, 32)

	if err := h.db.Model(&indexerdb.Seller{}).Where("seller_id = ?", seller_id).Update("seller_info_url", msg.SellerInfoUrl).Error; err != nil {
		return errors.Wrap(err, "failed to update seller info")
	}
	return nil
}
