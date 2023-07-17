package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type ReportMsg struct {
	SellerReport struct {
		Seller     string `json:"seller"`
		ReportData string `json:"report_data"`
	} `json:"seller_report"`
}

func (h *Handler) handleExecuteSellerReport(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.ReportContractAddress {
		return nil
	}

	var msg ReportMsg

	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal add_gig msg")
	}
	var reportDataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(msg.SellerReport.ReportData), &reportDataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}
	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	if err := h.db.Create(&indexerdb.Report{
		SellerBuyer: msg.SellerReport.Seller,
		IsSeller:    true,
		ReportData:  reportDataJSON,
		Sender:      execMsg.Sender,
		Time:        blockTime,
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create report")
	}
	h.logger.Info("created report")
	return nil
}
