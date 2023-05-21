package indexerhandler

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type InstantiateContractWithSelfAdminMsg struct {
	InstantiateContractWithSelfAdmin struct {
		InstantiateMsg []byte `json:"instantiate_msg"`
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

type DaoMember struct {
	Address string `json:"addr"`
	Weight  string `json:"weight"`
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
	var bliblu interface{}
	json.Unmarshal(encInstantiateMsg, &bliblu)
	fmt.Println("raw msg")
	spew.Dump(bliblu)
	json.Unmarshal(encInstantiateMsg, &instantiateMsg)
	fmt.Println("instantiate msg")
	spew.Dump(instantiateMsg)
	if len(instantiateMsg.ProposalModulesInstantiateInfos) != 0 {
		encProposalModulesInstantiateInfoMsg := instantiateMsg.ProposalModulesInstantiateInfos[0].Msg
		decProposalModulesInstantiateInfoMsg, _ := base64.StdEncoding.DecodeString(encProposalModulesInstantiateInfoMsg)
		json.Unmarshal(decProposalModulesInstantiateInfoMsg, &proposalModulesInsantiateInfoMsg)

		fmt.Println("proposal module msg")
		spew.Dump(proposalModulesInsantiateInfoMsg)
	}

	encVotingModuleInstantiateMsg := instantiateMsg.VotingModuleInstantiateInfos.Msg
	decVotingModuleInstantiateMsg, _ := base64.StdEncoding.DecodeString(encVotingModuleInstantiateMsg)
	fmt.Println("raw voting module msg")
	fmt.Println(string(decVotingModuleInstantiateMsg))
	json.Unmarshal(decVotingModuleInstantiateMsg, &votingModuleInstantiateMsg)

	fmt.Println("voting module msg")
	spew.Dump(votingModuleInstantiateMsg)

	contractAddresses := e.Events["wasm._contract_address"]
	daoContractAddress := contractAddresses[1]

	threshold := ""
	if proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent != "" {
		threshold = proposalModulesInsantiateInfoMsg.Threshold.Threshold.Percent
	} else {
		threshold = "MAJORITY"
	}

	dao := &indexerdb.Dao{
		ContractAddress:        daoContractAddress,
		Admin:                  instantiateMsg.Admin,
		Name:                   instantiateMsg.Name,
		Description:            instantiateMsg.Description,
		ImageUrl:               instantiateMsg.ImageUrl,
		AutomaticallyAddCw20s:  instantiateMsg.AutomaticallyAddCw20s,
		AutomaticallyAddCw721s: instantiateMsg.AutomaticallyAddCw721s,
		Quorum:                 proposalModulesInsantiateInfoMsg.Threshold.ThresholdQuorum.Quorum.Percent,
		Threshold:              threshold,
		NetworkID:              h.config.Network.ID,
	}

	if votingModuleInstantiateMsg.TokenInfo != nil {
		dao.TokenName = votingModuleInstantiateMsg.TokenInfo.New.Name
		dao.TokenSymbol = votingModuleInstantiateMsg.TokenInfo.New.Symbol
		dao.UnstakingDuration = votingModuleInstantiateMsg.TokenInfo.New.UnstakingDuration.Time
	} else {
		members := make([]*indexerdb.DaoMember, len(votingModuleInstantiateMsg.InitialMembers))
		for i, m := range votingModuleInstantiateMsg.InitialMembers {
			members[i] = &indexerdb.DaoMember{
				DaoNetworkID:       h.config.Network.ID,
				DaoContractAddress: daoContractAddress,
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
