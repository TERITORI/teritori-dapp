package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type ExecReportMsg struct {
	SellerReport SellerReportMsg `json:"seller_report"`
}
type SellerReportMsg struct {
	Seller     string `json:"seller"`
	ReportData string `json:"report_data"`
}

func (h *Handler) handleExecuteSellerReport(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceReportContractAddress {
		return nil
	}

	var execReportMsg ExecReportMsg

	if err := json.Unmarshal(execMsg.Msg, &execReportMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal report msg")
	}
	sellerReport := execReportMsg.SellerReport
	var reportDataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(sellerReport.ReportData), &reportDataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}
	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	if err := h.db.Create(&indexerdb.FreelanceReport{
		SellerBuyer: sellerReport.Seller,
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
