import {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/stargate";

import { DaoCoreQueryClient } from "../contracts-clients/dao-core/DaoCore.client";
import { DaoPreProposeSingleClient } from "../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.client";
import { ProposeMessage } from "../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { DaoProposalSingleQueryClient } from "../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  getKeplrSigningCosmWasmClient,
} from "../networks";

export interface TokenHolder {
  address: string;
  amount: string;
}
export interface DaoMember {
  addr: string;
  weight: number;
}

export const createDaoTokenBased = async (
  {
    client,
    sender,
    contractAddress,
    daoPreProposeSingleCodeId,
    daoProposalSingleCodeId,
    daoCw20CodeId,
    daoCw20StakeCodeId,
    daoVotingCw20StakedCodeId,
    daoCoreCodeId,
    name,
    description,
    tns,
    imageUrl,
    tokenName,
    tokenSymbol,
    tokenHolders,
    quorum,
    threshold,
    maxVotingPeriod,
  }: {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    daoPreProposeSingleCodeId: number;
    daoProposalSingleCodeId: number;
    daoCw20CodeId: number;
    daoCw20StakeCodeId: number;
    daoVotingCw20StakedCodeId: number;
    daoCoreCodeId: number;
    name: string;
    description: string;
    tns: string;
    imageUrl: string;
    tokenHolders: TokenHolder[];
    quorum: string;
    maxVotingPeriod: number;
    threshold: string;
    tokenName: string;
    tokenSymbol: string;
  },
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[]
): Promise<ExecuteResult> => {
  const dao_pre_propose_single_msg = {
    deposit_info: null,
    extension: {},
    open_proposal_submission: false,
  };
  const dao_proposal_single_msg = {
    threshold: {
      threshold_quorum: {
        quorum: { percent: quorum },
        threshold: {
          percent: threshold,
        },
      },
    },
    max_voting_period: {
      time: maxVotingPeriod,
    },
    min_voting_period: null,
    only_members_execute: true, // need to fix
    allow_revoting: false,
    close_proposal_on_execution_failure: true,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: daoPreProposeSingleCodeId,
          msg: Buffer.from(JSON.stringify(dao_pre_propose_single_msg)).toString(
            "base64"
          ),
          admin: { core_module: {} },
          label: `DAO_${name}_pre-propose-DaoProposalSingle`,
        },
      },
    },
  };
  const proposal_modules_instantiate_info = [
    {
      admin: { core_module: {} },
      code_id: daoProposalSingleCodeId,
      label: `DAO_${name}_DAOProposalSingle`,
      msg: Buffer.from(JSON.stringify(dao_proposal_single_msg)).toString(
        "base64"
      ),
    },
  ];

  const dao_voting_cw20_staked_msg = {
    token_info: {
      new: {
        code_id: daoCw20CodeId,
        decimals: 6,
        initial_balances: tokenHolders,
        initial_dao_balance: null,
        label: tokenName,
        name: tokenName,
        symbol: tokenSymbol,
        staking_code_id: daoCw20StakeCodeId,
        unstaking_duration: null,
      },
    },
  };

  const voting_module_instantiate_info = {
    admin: { core_module: {} },
    code_id: daoVotingCw20StakedCodeId,
    label: `DAO_${name}_DaoVotingCw20Staked`,
    msg: Buffer.from(JSON.stringify(dao_voting_cw20_staked_msg)).toString(
      "base64"
    ),
  };

  const dao_core_instantiate_msg = {
    admin: null,
    automatically_add_cw20s: true,
    automatically_add_cw721s: true,
    name,
    description,
    tns,
    image_url: imageUrl,
    proposal_modules_instantiate_info,
    voting_module_instantiate_info,
  };
  const instantiate_msg = Buffer.from(
    JSON.stringify(dao_core_instantiate_msg)
  ).toString("base64");

  return await client.execute(
    sender,
    contractAddress,
    {
      instantiate_contract_with_self_admin: {
        code_id: daoCoreCodeId,
        instantiate_msg,
        label: name,
      },
    },
    fee,
    memo,
    funds
  );
};

export const createDaoMemberBased = async (
  {
    client,
    sender,
    contractAddress,
    daoCoreCodeId,
    daoPreProposeSingleCodeId,
    daoProposalSingleCodeId,
    daoCw4GroupCodeId,
    daoVotingCw4CodeId,
    name,
    description,
    tns,
    imageUrl,
    members,
    quorum,
    threshold,
    maxVotingPeriod,
  }: {
    client: SigningCosmWasmClient;
    sender: string;
    contractAddress: string;
    daoCoreCodeId: number;
    daoPreProposeSingleCodeId: number;
    daoProposalSingleCodeId: number;
    daoCw4GroupCodeId: number;
    daoVotingCw4CodeId: number;
    name: string;
    description: string;
    tns: string;
    imageUrl: string;
    members: DaoMember[];
    quorum: string;
    maxVotingPeriod: number;
    threshold: string;
  },
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[]
): Promise<ExecuteResult> => {
  const dao_pre_propose_single_msg = {
    deposit_info: null,
    extension: {},
    open_proposal_submission: false,
  };
  const dao_proposal_single_msg = {
    threshold: {
      threshold_quorum: {
        quorum: { percent: quorum },
        threshold: {
          percent: threshold,
        },
      },
    },
    max_voting_period: {
      time: maxVotingPeriod,
    },
    min_voting_period: null,
    only_members_execute: true, // need to fix
    allow_revoting: false,
    close_proposal_on_execution_failure: true,
    pre_propose_info: {
      module_may_propose: {
        info: {
          code_id: daoPreProposeSingleCodeId,
          msg: Buffer.from(JSON.stringify(dao_pre_propose_single_msg)).toString(
            "base64"
          ),
          admin: { core_module: {} },
          label: `DAO_${name}_pre-propose-DaoProposalSingle`,
        },
      },
    },
  };
  const proposal_modules_instantiate_info = [
    {
      admin: { core_module: {} },
      code_id: daoProposalSingleCodeId,
      label: `DAO_${name}_DAOProposalSingle`,
      msg: Buffer.from(JSON.stringify(dao_proposal_single_msg)).toString(
        "base64"
      ),
    },
  ];

  const dao_voting_cw4_msg = {
    cw4_group_code_id: daoCw4GroupCodeId,
    initial_members: members,
  };

  const voting_module_instantiate_info = {
    admin: { core_module: {} },
    code_id: daoVotingCw4CodeId,
    label: `DAO_${name}_DaoVotingCw4`,
    msg: Buffer.from(JSON.stringify(dao_voting_cw4_msg)).toString("base64"),
  };

  const dao_core_instantiate_msg = {
    admin: null,
    automatically_add_cw20s: true,
    automatically_add_cw721s: true,
    name,
    description,
    tns,
    image_url: imageUrl,
    proposal_modules_instantiate_info,
    voting_module_instantiate_info,
  };
  const instantiate_msg = Buffer.from(
    JSON.stringify(dao_core_instantiate_msg)
  ).toString("base64");

  return await client.execute(
    sender,
    contractAddress,
    {
      instantiate_contract_with_self_admin: {
        code_id: daoCoreCodeId,
        instantiate_msg,
        label: name,
      },
    },
    fee,
    memo,
    funds
  );
};

export const makeProposal = async (
  networkId: string | undefined,
  sender: string | undefined,
  daoAddress: string | undefined,
  proposal: ProposeMessage["propose"]
) => {
  if (!daoAddress) {
    throw new Error("no DAO address");
  }
  if (!sender) {
    throw new Error("no sender address");
  }

  const network = mustGetCosmosNetwork(networkId);

  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  const daoCoreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);

  const proposalModules = await daoCoreClient.proposalModules({});
  if (proposalModules.length === 0) {
    throw new Error("no proposal module");
  }
  const proposalModuleAddress = proposalModules[0].address;
  const proposalClient = new DaoProposalSingleQueryClient(
    cosmwasmClient,
    proposalModuleAddress
  );

  const proposalCreationPolicy = await proposalClient.proposalCreationPolicy();
  if (!("module" in proposalCreationPolicy)) {
    throw new Error("proposal creation policy is not module");
  }
  const signingClient = await getKeplrSigningCosmWasmClient(network.id);
  const preProposeClient = new DaoPreProposeSingleClient(
    signingClient,
    sender,
    proposalCreationPolicy.module.addr
  );
  const res = await preProposeClient.propose({
    msg: {
      propose: proposal,
    },
  });
  return res;
};
