package indexerhandler

import (
	"encoding/json"
	"strconv"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type InstantiateContractWithSelfAdminMsg struct {
	InstantiateContractWithSelfAdmin struct {
		InstantiateMsg []byte `json:"instantiate_msg"`
		CodeId         uint   `json:"code_id"`
		Label          string `json:"label"`
	} `json:"instantiate_contract_with_self_admin"`
}

type ProposalModulesInstantiateInfoMsg struct {
	Msg []byte `json:"msg"`
}
type VotingModuleInstantiateInfoMsg struct {
	Msg []byte `json:"msg"`
}

type DaoMember struct {
	Address string `json:"addr"`
	Weight  uint64 `json:"weight"`
}

type InstantiateMsg struct {
	Admin                           string                              `json:"admin"`
	AutomaticallyAddCw20s           bool                                `json:"automatically_add_cw20s"`
	AutomaticallyAddCw721s          bool                                `json:"automatically_add_cw721s"`
	Description                     string                              `json:"description"`
	ImageUrl                        string                              `json:"image_url"`
	Name                            string                              `json:"name"`
	ProposalModulesInstantiateInfos []ProposalModulesInstantiateInfoMsg `json:"proposal_modules_instantiate_info"`
	VotingModuleInstantiateInfos    VotingModuleInstantiateInfoMsg      `json:"voting_module_instantiate_info"`
}
type ProposalModulesInstantiateInfo struct {
	Threshold struct {
		ThresholdQuorum struct {
			Quorum struct {
				Percent string `json:"percent"`
			} `json:"quorum"`
		} `json:"threshold_quorum"`
		Threshold struct {
			Percent  string   `json:"percent"`
			Majority struct{} `json:"majority"`
		}
	} `json:"threshold"`
}

type VotingModuleInstantiateInfo struct {
	TokenInfo *struct {
		New struct {
			Name              string `json:"name"`
			Symbol            string `json:"symbol"`
			UnstakingDuration struct {
				Time uint `json:"time"`
			} `json:"unstaking_duration"`
		} `json:"new"`
	} `json:"token_info"`
	InitialMembers []DaoMember `json:"initial_members"`
}

func (h *Handler) handleExecuteInstantiateContractWithSelfAdmin(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.Network.DaoFactoryContractAddress {
		h.logger.Debug("ignored instantiate dao from unknown factory", zap.String("tx", e.TxHash), zap.String("factory-address", contractAddress))
		return nil
	}

	// TODO: support multiple proposal modules
	proposalModuleAddress, err := e.Events.First("wasm.proposal_module")
	if err != nil {
		h.logger.Debug("ignored instantiate dao with no proposal module address", zap.String("tx", e.TxHash), zap.Error(err))
		return nil
	}

	preProposeAddress, err := e.Events.First("wasm.update_pre_propose_module")
	if err != nil {
		h.logger.Debug("ignored instantiate dao with no pre-propose module address", zap.String("tx", e.TxHash), zap.Error(err))
		return nil
	}

	// TODO: support other dao kinds (only supports member-based for now)
	groupContractAddress, err := e.Events.First("wasm.group_contract_address")
	if err != nil {
		h.logger.Debug("ignored instantiate dao with no group contract address", zap.String("tx", e.TxHash), zap.Error(err))
		return nil
	}

	var msg InstantiateContractWithSelfAdminMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal instantiate_contract_with_admin msg")
	}

	var instantiateMsg InstantiateMsg
	if err := json.Unmarshal(msg.InstantiateContractWithSelfAdmin.InstantiateMsg, &instantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal instantiate msg")
	}

	if len(instantiateMsg.ProposalModulesInstantiateInfos) == 0 {
		return errors.New("no proposal module config")
	}
	var proposalModulesInsantiateInfoMsg ProposalModulesInstantiateInfo
	if err := json.Unmarshal(instantiateMsg.ProposalModulesInstantiateInfos[0].Msg, &proposalModulesInsantiateInfoMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal proposal module config")
	}

	var votingModuleInstantiateMsg VotingModuleInstantiateInfo
	if err := json.Unmarshal(instantiateMsg.VotingModuleInstantiateInfos.Msg, &votingModuleInstantiateMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal voting module config")
	}

	// FIXME: get contract address in a more robust way
	contractAddresses := e.Events["wasm._contract_address"]
	daoContractAddress := contractAddresses[1]

	threshold := ""
	if proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent != "" {
		threshold = proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent
	} else {
		threshold = "MAJORITY"
	}

	dao := &indexerdb.DAO{
		ContractAddress:         daoContractAddress,
		Admin:                   instantiateMsg.Admin,
		Name:                    instantiateMsg.Name,
		Description:             instantiateMsg.Description,
		ImageUrl:                instantiateMsg.ImageUrl,
		AutomaticallyAddCw20s:   instantiateMsg.AutomaticallyAddCw20s,
		AutomaticallyAddCw721s:  instantiateMsg.AutomaticallyAddCw721s,
		Quorum:                  proposalModulesInsantiateInfoMsg.Threshold.ThresholdQuorum.Quorum.Percent,
		Threshold:               threshold,
		NetworkID:               h.config.Network.ID,
		GroupContractAddress:    groupContractAddress,
		PreProposeModuleAddress: preProposeAddress,
		ProposalModuleAddress:   proposalModuleAddress,
	}

	if votingModuleInstantiateMsg.TokenInfo != nil {
		dao.TokenName = votingModuleInstantiateMsg.TokenInfo.New.Name
		dao.TokenSymbol = votingModuleInstantiateMsg.TokenInfo.New.Symbol
		dao.UnstakingDuration = votingModuleInstantiateMsg.TokenInfo.New.UnstakingDuration.Time
	} else {
		members := make([]*indexerdb.DAOMember, len(votingModuleInstantiateMsg.InitialMembers))
		for i, m := range votingModuleInstantiateMsg.InitialMembers {
			members[i] = &indexerdb.DAOMember{
				DAONetworkID:       h.config.Network.ID,
				DAOContractAddress: daoContractAddress,
				MemberAddress:      m.Address,
			}
		}
		dao.Members = members
	}

	if err := h.db.Create(dao).Error; err != nil {
		return errors.Wrap(err, "faild to save dao")
	}
	h.logger.Info("created dao", zap.Any("dao", dao))

	return nil
}

type ProposalMsg struct {
	Wasm *json.RawMessage `json:"wasm"`
}

type DAOExecuteMsg struct {
	Execute struct {
		ProposalID uint64 `json:"proposal_id"`
	} `json:"execute"`
}

func (h *Handler) handleExecuteDAOExecute(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// check that the proposal did not fail
	if _, ok := e.Events["wasm.proposal_execution_failed"]; ok {
		h.logger.Debug("ignored dao execute with failed execution", zap.String("tx", e.TxHash))
		return nil
	}

	// find dao
	var dao indexerdb.DAO
	err := h.db.First(&dao, "network_id = ? AND proposal_module_address = ?", h.config.Network.ID, execMsg.Contract).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		h.logger.Debug("ignored dao execute for unknown dao", zap.String("tx", e.TxHash), zap.String("sender", execMsg.Sender))
		return nil
	} else if err != nil {
		return errors.Wrap(err, "failed to query dao")
	}

	// parse daoExecuteMsg
	var daoExecuteMsg DAOExecuteMsg
	if err := json.Unmarshal(execMsg.Msg, &daoExecuteMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal dao execute msg")
	}

	// find proposal
	var proposal indexerdb.DAOProposal
	err = h.db.First(&proposal, "dao_network_id = ? AND dao_contract_address = ? AND proposal_id = ?", dao.NetworkID, dao.ContractAddress, daoExecuteMsg.Execute.ProposalID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		h.logger.Debug("ignored dao execute for unknown proposal", zap.String("tx", e.TxHash), zap.String("dao", dao.ContractAddress), zap.Uint64("proposal-id", daoExecuteMsg.Execute.ProposalID))
		return nil
	} else if err != nil {
		return errors.Wrap(err, "failed to query dao")
	}

	// handle proposal messages
	var msgs []ProposalMsg
	if err := json.Unmarshal(proposal.Msgs, &msgs); err != nil {
		return errors.Wrap(err, "failed to unmarshal proposal msgs")
	}
	for _, msg := range msgs {
		if msg.Wasm == nil {
			h.logger.Debug("ignored dao execute sub message with unknown type")
			continue
		}

		var subExecMsg struct {
			Execute *struct {
				Msg          []byte `json:"msg"`
				ContractAddr string `json:"contract_addr"`
				// Funds        []json.RawMessage `json:"funds"`
			} `json:"execute"`
		}
		if err := json.Unmarshal(*msg.Wasm, &subExecMsg); err != nil {
			return errors.Wrap(err, "failed to unmarshal sub exec message")
		}

		var payload map[string]json.RawMessage
		if err := json.Unmarshal(subExecMsg.Execute.Msg, &payload); err != nil {
			return errors.Wrap(err, "failed to unmarshal sub exec payload")
		}
		action := ""
		for a := range payload {
			action = a
			break
		}
		if action == "" {
			return errors.Wrap(err, "failed to get sub exec action")
		}

		// TODO: generic reuse of other handlers (need to transform logs)
		// FIXME: pass funds
		// for now we have to ensure we only call handlers that use a safe subset of e and do not use funds
		syntheticExecMsg := &wasmtypes.MsgExecuteContract{
			Contract: subExecMsg.Execute.ContractAddr,
			Sender:   dao.ContractAddress,
			Msg:      subExecMsg.Execute.Msg,
			// Funds:    subExecMsg.Execute.Funds,
		}

		h.logger.Debug("dao wasm", zap.String("action", action), zap.String("contract", syntheticExecMsg.Contract), zap.Int64("height", e.Height))

		switch action {
		case "update_members":
			return h.handleExecuteDAOUpdateMembers(e, syntheticExecMsg)
		case "update_metadata":
			return h.handleExecuteUpdateTNSMetadata(e, syntheticExecMsg)
		case "create_post":
			return h.handleExecuteCreatePost(e, syntheticExecMsg)
		}

		h.logger.Debug("ignored dao execute sub message with unknown action", zap.String("action", action), zap.String("payload", string(string(subExecMsg.Execute.Msg))), zap.String("tx", e.TxHash), zap.String("dao", dao.ContractAddress), zap.Uint64("proposal-id", daoExecuteMsg.Execute.ProposalID))
	}

	return nil
}

type UpdateMembers struct {
	UpdateMembers struct {
		Add    []DaoMember `json:"add"`
		Remove []string    `json:"remove"`
	} `json:"update_members"`
}

func (h *Handler) handleExecuteDAOUpdateMembers(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// find dao
	var dao indexerdb.DAO
	err := h.db.First(&dao, "network_id = ? AND group_contract_address = ?", h.config.Network.ID, execMsg.Contract).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		h.logger.Debug("ignored update_members for unknown dao", zap.String("tx", e.TxHash), zap.String("sender", execMsg.Sender))
		return nil
	} else if err != nil {
		return errors.Wrap(err, "failed to query dao")
	}

	// parse payload
	var payload UpdateMembers
	if err := json.Unmarshal(execMsg.Msg, &payload); err != nil {
		return errors.Wrap(err, "failed to unmarshal update_members msg")
	}

	// add/update members
	if len(payload.UpdateMembers.Add) != 0 {
		dbMembers := make([]*indexerdb.DAOMember, len(payload.UpdateMembers.Add))
		for i, m := range payload.UpdateMembers.Add {
			dbMembers[i] = &indexerdb.DAOMember{
				DAONetworkID:       h.config.Network.ID,
				DAOContractAddress: dao.ContractAddress,
				MemberAddress:      m.Address,
			}
		}
		if err := h.db.Clauses(clause.OnConflict{
			UpdateAll: true,
		}).Create(dbMembers).Error; err != nil {
			return errors.Wrap(err, "failed to save dao members")
		}
	}

	// remove members
	if len(payload.UpdateMembers.Remove) != 0 {
		result := h.db.Delete(&indexerdb.DAOMember{},
			"dao_network_id = ? AND dao_contract_address = ? AND member_address IN ?",
			h.config.Network.ID, dao.ContractAddress, payload.UpdateMembers.Remove,
		)
		if result.Error != nil {
			return errors.Wrap(err, "failed to delete dao members")
		}
		if result.RowsAffected != int64(len(payload.UpdateMembers.Remove)) {
			return errors.Wrap(err, "did not delete enough members")
		}
	}

	return nil
}

type DaoProposeMsg struct {
	Propose struct {
		Msg struct {
			Propose struct {
				Title       string          `json:"title"`
				Description string          `json:"description"`
				Msgs        json.RawMessage `json:"msgs"`
			} `json:"propose"`
		} `json:"msg"`
	} `json:"propose"`
}

func (h *Handler) handleExecuteDAOPropose(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	// find dao
	var dao indexerdb.DAO
	err := h.db.First(&dao, "network_id = ? AND pre_propose_module_address = ?", h.config.Network.ID, execMsg.Contract).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		h.logger.Debug("propose ignored for unknown dao", zap.String("tx", e.TxHash), zap.String("contract", execMsg.Contract))
		return nil
	} else if err != nil {
		return errors.Wrap(err, "failed to query dao")
	}

	// parse payload
	var msg DaoProposeMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal propose msg")
	}

	// get proposal id
	proposalIdString, err := e.Events.First("wasm.proposal_id")
	if err != nil {
		return errors.Wrap(err, "failed to get proposal id")
	}
	proposalId, err := strconv.ParseUint(proposalIdString, 10, 64)
	if err != nil {
		return errors.Wrap(err, "failed to parse proposal id")
	}

	// create proposal in db
	dbProposal := &indexerdb.DAOProposal{
		DAONetworkID:       h.config.Network.ID,
		DAOContractAddress: dao.ContractAddress,
		ProposalID:         proposalId,
		ProposerID:         h.config.Network.UserID(execMsg.Sender),
		Title:              msg.Propose.Msg.Propose.Title,
		Description:        msg.Propose.Msg.Propose.Description,
		Msgs:               datatypes.JSON(msg.Propose.Msg.Propose.Msgs),
	}
	if err := h.db.Create(&dbProposal).Error; err != nil {
		return errors.Wrap(err, "failed to create proposal")
	}

	h.logger.Info("created dao proposal", zap.Any("proposal", dbProposal))
	return nil
}
