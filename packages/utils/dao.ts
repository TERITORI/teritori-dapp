import {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/stargate";
import { Buffer } from "buffer";

import { InstantiateMsg as DaoCoreInstantiateMsg } from "@/contracts-clients/dao-core/DaoCore.types";
import { InstantiateMsg as PreProposeSingleInstantiateMsg } from "@/contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { InstantiateMsg as ProposalSingleInstantiateMsg } from "@/contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { InstantiateMsg as VotingCw4InstantiateMsg } from "@/contracts-clients/dao-voting-cw4/DaoVotingCw4.types";
import { TeritoriNameServiceClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getStakingCurrency, mustGetCosmosNetwork } from "@/networks";

interface TokenHolder {
  address: string;
  amount: string;
}
interface DaoMember {
  addr: string;
  weight: number;
}

export interface CreateDaoMemberBasedParams {
  signingCosmWasmClient: SigningCosmWasmClient;
  nameServiceClient: TeritoriNameServiceClient;
  networkId: string;
  sender: string;
  contractAddress: string;
  daoCoreCodeId: number;
  daoPreProposeSingleCodeId: number;
  daoProposalSingleCodeId: number;
  cw4GroupCodeId: number;
  daoVotingCw4CodeId: number;
  name: string;
  description: string;
  tns: string;
  imageUrl: string;
  members: DaoMember[];
  quorum: string;
  maxVotingPeriod: number;
  threshold: string;
  onStepChange?: (step: number) => Promise<void> | void;
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
  funds?: Coin[],
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
            "base64",
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
        "base64",
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
      "base64",
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
    JSON.stringify(dao_core_instantiate_msg),
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
    funds,
  );
};

export const createDaoMemberBased = async (
  {
    signingCosmWasmClient,
    nameServiceClient,
    sender,
    networkId,
    contractAddress,
    daoCoreCodeId,
    daoPreProposeSingleCodeId,
    daoProposalSingleCodeId,
    cw4GroupCodeId,
    daoVotingCw4CodeId,
    name,
    description,
    tns,
    imageUrl,
    members,
    quorum,
    threshold,
    maxVotingPeriod,
    onStepChange,
  }: CreateDaoMemberBasedParams,
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[],
) => {
  await onStepChange?.(0);

  const dao_pre_propose_single_msg: PreProposeSingleInstantiateMsg = {
    deposit_info: null,
    extension: {},
    open_proposal_submission: false,
  };
  const dao_proposal_single_msg: ProposalSingleInstantiateMsg = {
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
            "base64",
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
        "base64",
      ),
    },
  ];

  const dao_voting_cw4_msg: VotingCw4InstantiateMsg = {
    cw4_group_code_id: cw4GroupCodeId,
    initial_members: members,
  };

  const voting_module_instantiate_info = {
    admin: { core_module: {} },
    code_id: daoVotingCw4CodeId,
    label: `DAO_${name}_DaoVotingCw4`,
    msg: Buffer.from(JSON.stringify(dao_voting_cw4_msg)).toString("base64"),
  };

  const dao_core_instantiate_msg: DaoCoreInstantiateMsg = {
    admin: null,
    automatically_add_cw20s: true,
    automatically_add_cw721s: true,
    name,
    description,
    image_url: imageUrl,
    proposal_modules_instantiate_info,
    voting_module_instantiate_info,
  };

  const instantiate_msg = Buffer.from(
    JSON.stringify(dao_core_instantiate_msg),
  ).toString("base64");

  const network = mustGetCosmosNetwork(networkId);

  if (!network.nameServiceContractAddress) {
    throw new Error("no name service contract address");
  }

  const tokenId = (tns + network.nameServiceTLD).toLowerCase();
  const amount = await nameServiceClient.mintPrice({
    tokenId,
  });
  const denom = getStakingCurrency(networkId)?.denom;

  await nameServiceClient.mint(
    {
      owner: sender,
      tokenId,
      extension: {
        public_name: dao_core_instantiate_msg.name,
        image: dao_core_instantiate_msg.image_url,
        public_bio: dao_core_instantiate_msg.description,
      },
    },
    "auto",
    undefined,
    amount && denom ? [{ denom, amount }] : [],
  );

  const executeResult = await signingCosmWasmClient.execute(
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
    funds,
  );
  const daoAddress = executeResult.logs
    .find((l) => l.events.find((e) => e.type === "instantiate"))
    ?.events.find((e) => e.type === "instantiate")
    ?.attributes.find((a) => a.key === "_contract_address")?.value;
  if (!daoAddress) {
    throw new Error("No DAO address in transaction results");
  }

  await nameServiceClient.transferNft({
    recipient: daoAddress,
    tokenId,
  });

  await onStepChange?.(1);

  // TODO: invalidate name info

  return { daoAddress, executeResult };
};
