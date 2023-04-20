package indexerhandler

import (
	"encoding/base64"
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type InstantiateContractWithSelfAdminMsg struct {
	InstantiateContractWithSelfAdmin struct {
		InstantiateMsg string `json:"instantiate_msg"`
		CodeId         uint   `json:"code_id"`
		Label          string `json:"label"`
	} `json:"instantiate_contract_with_self_admin"`
}

type ProposalModulesInstantiateInfoMsg struct {
	Msg string `json:"msg"`
}
type VotingModuleInstantiateInfoMsg struct {
	Msg string `json:"msg"`
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
	TokenInfo struct {
		New struct {
			Name              string `json:"name"`
			Symbol            string `json:"symbol"`
			UnstakingDuration struct {
				Time uint `json:"time"`
			} `json:"unstaking_duration"`
		} `json:"new"`
	} `json:"token_info"`
}

func (h *Handler) handleExecuteInstantiateContractWithSelfAdmin(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	contractAddress := execMsg.Contract
	if contractAddress != h.config.DaoFactoryContractAddress {
		return nil
	}
	var msg InstantiateContractWithSelfAdminMsg
	if err := json.Unmarshal(execMsg.Msg, &msg); err != nil {
		return errors.Wrap(err, "failed to unmarshal instantiate_contract_with_admin msg")
	}
	instantiateMsg := InstantiateMsg{}
	proposalModulesInsantiateInfoMsg := ProposalModulesInstantiateInfo{}
	votingModuleInstantiateMsg := VotingModuleInstantiateInfo{}

	encInstantiateMsg := msg.InstantiateContractWithSelfAdmin.InstantiateMsg
	decInstantiateMsg, _ := base64.StdEncoding.DecodeString(encInstantiateMsg)
	json.Unmarshal(decInstantiateMsg, &instantiateMsg)
	if len(instantiateMsg.ProposalModulesInstantiateInfos) != 0 {
		encProposalModulesInstantiateInfoMsg := instantiateMsg.ProposalModulesInstantiateInfos[0].Msg
		decProposalModulesInstantiateInfoMsg, _ := base64.StdEncoding.DecodeString(encProposalModulesInstantiateInfoMsg)
		json.Unmarshal(decProposalModulesInstantiateInfoMsg, &proposalModulesInsantiateInfoMsg)
	}

	encVotingModuleInstantiateMsg := instantiateMsg.VotingModuleInstantiateInfos.Msg
	decVotingModuleInstantiateMsg, _ := base64.StdEncoding.DecodeString(encVotingModuleInstantiateMsg)
	json.Unmarshal(decVotingModuleInstantiateMsg, &votingModuleInstantiateMsg)

	contractAddresses := e.Events["wasm._contract_address"]
	daoContractAddress := contractAddresses[1]

	threshold := ""
	if proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent != "" {
		threshold = proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent
	} else {
		threshold = "MAJORITY"
	}

	if err := h.db.Create(&indexerdb.Dao{
		Address:                daoContractAddress,
		Admin:                  instantiateMsg.Admin,
		Name:                   instantiateMsg.Name,
		Description:            instantiateMsg.Description,
		ImageUrl:               instantiateMsg.ImageUrl,
		AutomaticallyAddCw20s:  instantiateMsg.AutomaticallyAddCw20s,
		AutomaticallyAddCw721s: instantiateMsg.AutomaticallyAddCw721s,
		Quorum:                 proposalModulesInsantiateInfoMsg.Threshold.ThresholdQuorum.Quorum.Percent,
		Threshold:              threshold,
		TokenName:              votingModuleInstantiateMsg.TokenInfo.New.Name,
		TokenSymbol:            votingModuleInstantiateMsg.TokenInfo.New.Symbol,
		UnstakingDuration:      votingModuleInstantiateMsg.TokenInfo.New.UnstakingDuration.Time,
	}).Error; err != nil {
		return errors.Wrap(err, "faild to save dao")
	}
	h.logger.Info("create dao")
	return nil
}
