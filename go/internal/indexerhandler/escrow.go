package indexerhandler

import (
	"encoding/json"
	"strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type CreateContractMsg struct {
	CreateContract struct {
		Receiver string `json:"receiver"`
		ExpireAt uint64 `json:"expire_at"`
	} `json:"create_contract"`
}

func (h *Handler) handleExecuteEscrowCreateContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}
	ids := e.Events["wasm.id"]
	if len(ids) == 0 {
		return errors.New("no contract_id")
	}
	id, _ := strconv.ParseUint(ids[0], 10, 32)

	spenders := e.Events["coin_spent.spender"]
	if len(spenders) < 1 {
		return errors.New("failed to get spender")
	}
	spender := spenders[0]

	spentAmounts := e.Events["coin_spent.amount"]
	if len(spentAmounts) < 1 {
		return errors.New("failed to get amount")
	}
	spentAmount := spentAmounts[0]
	matches := amountRegexp.FindStringSubmatch(spentAmount)
	if len(matches) != 3 {
		return errors.New("failed to unmarshal amount")
	}
	amount := matches[1]
	denom := matches[2]

	// get block time
	blockTime, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	var msg CreateContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal create_contract msg")
	}

	if err := h.db.Create(&indexerdb.Escrow{
		Id:          uint32(id),
		Sender:      spender,
		Receiver:    msg.CreateContract.Receiver,
		ExpireAt:    msg.CreateContract.ExpireAt,
		Amount:      amount,
		AmountDenom: denom,
		Time:        blockTime,
		Status:      0, //created
	}).Error; err != nil {
		return errors.Wrap(err, "failed to create create_contract")
	}
	h.logger.Info("created create_contract")
	return nil
}

type AcceptContractMsg struct {
	AcceptContract struct {
		Id uint64 `json:"id"`
	} `json:"accept_contract"`
}

func (h *Handler) handleExecuteEscrowAcceptContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg AcceptContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal accept_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.AcceptContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 1 //accept
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type CancelContractMsg struct {
	CancelContract struct {
		Id uint64 `json:"id"`
	} `json:"cancel_contract"`
}

func (h *Handler) handleExecuteEscrowCancelContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg CancelContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal cancel_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.CancelContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 2 //cancel
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type PauseContractMsg struct {
	PauseContract struct {
		Id uint64 `json:"id"`
	} `json:"pause_contract"`
}

func (h *Handler) handleExecuteEscrowPauseContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg PauseContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal pause_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.PauseContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 3 //pause
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type ResumeContractMsg struct {
	ResumeContract struct {
		Id                uint64 `json:"id"`
		IncreasedExpireAt uint64 `json:"increased_expire_at"`
	} `json:"resume_contract"`
}

func (h *Handler) handleExecuteEscrowResumeContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg ResumeContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal pause_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.ResumeContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 1 //accept
	escrow.ExpireAt += msg.ResumeContract.IncreasedExpireAt
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type CompleteContractMsg struct {
	CompleteContract struct {
		Id uint64 `json:"id"`
	} `json:"complete_contract"`
}

func (h *Handler) handleExecuteEscrowCompleteContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg CompleteContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal complete_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.CompleteContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 4 //complete
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type CompleteContractByDaoMsg struct {
	CompleteContractByDao struct {
		Id              uint64 `json:"id"`
		AmountForClient string `json:"amount_for_client"`
		AmountForSeller string `json:"amount_for_seller"`
	} `json:"complete_contract_by_dao"`
}

func (h *Handler) handleExecuteEscrowCompleteContractByDao(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.EscrowContractAddress {
		return nil
	}

	var msg CompleteContractByDaoMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal complete_contract msg")
	}
	var escrow indexerdb.Escrow
	if err := h.db.First(&escrow, msg.CompleteContractByDao.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 4 //complete
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}
