package indexerhandler

import (
	"encoding/json"
	"strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type ExecCreateContractMsg struct {
	CreateContract CreateContractMsg `json:"create_contract"`
}

type CreateContractMsg struct {
	Receiver string `json:"receiver"`
	ExpireAt uint64 `json:"expire_at"`
}

func (h *Handler) handleExecuteEscrowCreateContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
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

	var execCreateContractMsg ExecCreateContractMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateContractMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal create_contract msg")
	}
	createContract := execCreateContractMsg.CreateContract

	if err := h.db.Create(&indexerdb.FreelanceEscrow{
		Id:          uint32(id),
		Sender:      spender,
		Receiver:    createContract.Receiver,
		ExpireAt:    createContract.ExpireAt,
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

type ExecAcceptContractMsg struct {
	AcceptContract AcceptContractMsg `json:"accept_contract"`
}
type AcceptContractMsg struct {
	Id uint64 `json:"id"`
}

func (h *Handler) handleExecuteEscrowAcceptContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var execAcceptContractMsg ExecAcceptContractMsg
	if err := json.Unmarshal(execMsg.Msg, &execAcceptContractMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal accept_contract msg")
	}
	acceptContract := execAcceptContractMsg.AcceptContract
	var escrow indexerdb.FreelanceEscrow
	if err := h.db.First(&escrow, acceptContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 1 //accept
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type ExecCancelContractMsg struct {
	CancelContract CancelContractMsg `json:"cancel_contract"`
}

type CancelContractMsg struct {
	Id uint64 `json:"id"`
}

func (h *Handler) handleExecuteEscrowCancelContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var execCancelContractMsg ExecCancelContractMsg
	if err := json.Unmarshal(execMsg.Msg, &execCancelContractMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal cancel_contract msg")
	}
	cancelContract := execCancelContractMsg.CancelContract

	var escrow indexerdb.FreelanceEscrow
	if err := h.db.First(&escrow, cancelContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 2 //cancel
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type ExecPauseContractMsg struct {
	PauseContract PauseContractMsg `json:"pause_contract"`
}

type PauseContractMsg struct {
	Id uint64 `json:"id"`
}

func (h *Handler) handleExecuteEscrowPauseContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var execPauseContractMsg ExecPauseContractMsg
	if err := json.Unmarshal(execMsg.Msg, &execPauseContractMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal pause_contract msg")
	}
	pauseContract := execPauseContractMsg.PauseContract
	var escrow indexerdb.FreelanceEscrow
	if err := h.db.First(&escrow, pauseContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 3 //pause
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}

type ExecResumeContractMsg struct {
	ResumeContract ResumeContractMsg `json:"resume_contract"`
}
type ResumeContractMsg struct {
	Id                uint64 `json:"id"`
	IncreasedExpireAt uint64 `json:"increased_expire_at"`
}

func (h *Handler) handleExecuteEscrowResumeContract(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var execResumeContractMsg ExecResumeContractMsg
	if err := json.Unmarshal(execMsg.Msg, &execResumeContractMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal pause_contract msg")
	}
	resumeContract := execResumeContractMsg.ResumeContract
	var escrow indexerdb.FreelanceEscrow
	if err := h.db.First(&escrow, resumeContract.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 1 //accept
	escrow.ExpireAt += resumeContract.IncreasedExpireAt
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
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var msg CompleteContractMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal complete_contract msg")
	}
	var escrow indexerdb.FreelanceEscrow
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

type ExecCompleteContractByDaoMsg struct {
	CompleteContractByDao CompleteContractByDaoMsg `json:"complete_contract_by_dao"`
}

type CompleteContractByDaoMsg struct {
	Id              uint64 `json:"id"`
	AmountForClient string `json:"amount_for_client"`
	AmountForSeller string `json:"amount_for_seller"`
}

func (h *Handler) handleExecuteEscrowCompleteContractByDao(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.FreelanceEscrowContractAddress {
		return nil
	}

	var execCompleteContractByDaoMsg ExecCompleteContractByDaoMsg
	if err := json.Unmarshal(execMsg.Msg, &execCompleteContractByDaoMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal complete_contract msg")
	}
	completeContractByDao := execCompleteContractByDaoMsg.CompleteContractByDao
	var escrow indexerdb.FreelanceEscrow
	if err := h.db.First(&escrow, completeContractByDao.Id).Error; err != nil {
		return errors.Wrap(err, "failed to get escrow id")
	}
	escrow.Status = 4 //complete
	if err := h.db.Save(&escrow).Error; err != nil {
		return errors.Wrap(err, "failed to update escrow")
	}
	h.logger.Info("updated escrow status")
	return nil
}
