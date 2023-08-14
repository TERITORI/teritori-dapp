import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/stargate";

import { ipfsURLToHTTPURL, uploadFileToIPFS } from "./ipfs";
import { LocalFileData } from "./types/files";
import { Member } from "../contracts-clients/cw4-group/Cw4Group.types";
import {
  InstantiateMsg as InstantiateMsgCore,
  ModuleInstantiateInfo,
} from "../contracts-clients/dao-core/DaoCore.types";
import { InstantiateMsg as InstantiateMsgPrePropose } from "../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { InstantiateMsg as InstantiateMsgProposalSingle } from "../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { InstantiateMsg as InstantiateMsgCW20S } from "../contracts-clients/dao-voting-cw20-staked/DaoVotingCw20Staked.types";
import { InstantiateMsg as InstantiateMsgCW4 } from "../contracts-clients/dao-voting-cw4/DaoVotingCw4.types";
import { InstantiateMsg as InstantiateMsgCW721S } from "../contracts-clients/dao-voting-cw721-staked/DaoVotingCw721Staked.types";
import { TeritoriNameServiceClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  mustGetCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getStakingCurrency,
  CosmosNetworkInfo,
  getUserId,
} from "../networks";

export interface TokenHolder {
  address: string;
  amount: string;
}
type CreateDaoResult = Promise<
  | {
      daoAddress: string;
      executeResult: ExecuteResult;
    }
  | undefined
>;
type DaoInstantiateMsgType =
  | InstantiateMsgCW4
  | InstantiateMsgCW20S
  | InstantiateMsgCW721S;

// ====== CW721Staked - NFT based DAO
export const createDaoNftBased = async (
  {
    networkId,
    sender,
    contractAddress,
    name,
    description,
    tns,
    image,
    considerListedNFTs,
    nftContractAddress,
    quorum,
    threshold,
    maxVotingPeriod,
    userOwnsName,
    onStepChange,
    userIPFSKey,
  }: {
    networkId: string;
    sender: string;
    contractAddress: string;
    name: string;
    description: string;
    tns: string;
    image: LocalFileData;
    nftContractAddress: string;
    quorum: string;
    maxVotingPeriod: number;
    threshold: string;
    considerListedNFTs: boolean;
    userOwnsName: boolean;
    onStepChange: (step: number) => Promise<void> | void;
    userIPFSKey?: string;
  },
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[]
): CreateDaoResult => {
  const network = mustGetCosmosNetwork(networkId);
  if (!network.daoVotingCw721StakedCodeId) return;

  const dao_voting_cw721_staked_msg: InstantiateMsgCW721S = {
    nft_address: nftContractAddress,
    owner: {
      address: {
        addr: sender,
      },
    },
    unstaking_duration: null,
  };

  return await createDAO({
    quorum,
    threshold,
    maxVotingPeriod,
    onStepChange,
    daoVotingCodeId: network.daoVotingCw721StakedCodeId,
    daoVotingMsg: dao_voting_cw721_staked_msg,
    name,
    description,
    image,
    instantiateLabel: `DAO_${name}_DaoVotingCw721Staked`,
    sender,
    tns,
    network,
    userOwnsName,
    contractAddress,
    fee,
    memo,
    funds,
    userIPFSKey,
  });
};

// ====== CW4 - Token based DAO
export const createDaoTokenBased = async (
  {
    networkId,
    sender,
    contractAddress,
    name,
    description,
    tns,
    image,
    tokenName,
    tokenSymbol,
    tokenHolders,
    quorum,
    threshold,
    maxVotingPeriod,
    userOwnsName,
    onStepChange,
    userIPFSKey,
  }: {
    networkId: string;
    sender: string;
    contractAddress: string;
    name: string;
    description: string;
    tns: string;
    image: LocalFileData;
    tokenHolders: TokenHolder[];
    quorum: string;
    maxVotingPeriod: number;
    threshold: string;
    tokenName: string;
    tokenSymbol: string;
    userOwnsName: boolean;
    onStepChange: (step: number) => Promise<void> | void;
    userIPFSKey?: string;
  },
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[]
): CreateDaoResult => {
  const network = mustGetCosmosNetwork(networkId);
  if (
    !network.daoCw20CodeId ||
    !network.daoCw20StakeCodeId ||
    !network.daoVotingCw20StakedCodeId
  )
    return;

  const dao_voting_cw20_staked_msg: InstantiateMsgCW20S = {
    token_info: {
      new: {
        code_id: network.daoCw20CodeId,
        decimals: 6,
        initial_balances: tokenHolders,
        initial_dao_balance: null,
        label: tokenName,
        name: tokenName,
        symbol: tokenSymbol,
        staking_code_id: network.daoCw20StakeCodeId,
        unstaking_duration: null,
      },
    },
  };

  return await createDAO({
    quorum,
    threshold,
    maxVotingPeriod,
    onStepChange,
    daoVotingCodeId: network.daoVotingCw20StakedCodeId,
    daoVotingMsg: dao_voting_cw20_staked_msg,
    name,
    description,
    image,
    instantiateLabel: `DAO_${name}_DaoVotingCw20Staked`,
    sender,
    tns,
    network,
    userOwnsName,
    contractAddress,
    fee,
    memo,
    funds,
    userIPFSKey,
  });
};

// ====== CW20 - Member based DAO
export const createDaoMemberBased = async (
  {
    sender,
    networkId,
    contractAddress,
    name,
    description,
    tns,
    image,
    members,
    quorum,
    threshold,
    maxVotingPeriod,
    userOwnsName,
    onStepChange,
    userIPFSKey,
  }: {
    networkId: string;
    sender: string;
    contractAddress: string;
    name: string;
    description: string;
    tns: string;
    image: LocalFileData;
    members: Member[];
    quorum: string;
    maxVotingPeriod: number;
    threshold: string;
    userOwnsName: boolean;
    onStepChange: (step: number) => Promise<void> | void;
    userIPFSKey?: string;
  },
  fee: number | StdFee | "auto" = "auto",
  memo?: string,
  funds?: Coin[]
): CreateDaoResult => {
  const network = mustGetCosmosNetwork(networkId);
  if (!network.daoCw4GroupCodeId || !network.daoVotingCw4CodeId) return;

  const dao_voting_cw4_msg: InstantiateMsgCW4 = {
    cw4_group_code_id: network.daoCw4GroupCodeId,
    initial_members: members,
  };

  return await createDAO({
    quorum,
    threshold,
    maxVotingPeriod,
    onStepChange,
    daoVotingCodeId: network.daoVotingCw4CodeId,
    daoVotingMsg: dao_voting_cw4_msg,
    name,
    description,
    image,
    instantiateLabel: `DAO_${name}_DaoVotingCw4`,
    sender,
    tns,
    network,
    userOwnsName,
    contractAddress,
    fee,
    memo,
    funds,
    userIPFSKey,
  });
};

const createDAO = async ({
  quorum,
  threshold,
  maxVotingPeriod,
  daoVotingMsg,
  daoVotingCodeId,
  name,
  description,
  image,
  instantiateLabel,
  sender,
  tns,
  network,
  contractAddress,
  fee = "auto",
  memo,
  funds,
  onStepChange,
  userOwnsName,
  userIPFSKey,
}: {
  quorum: string;
  threshold: string;
  maxVotingPeriod: number;
  daoVotingMsg: DaoInstantiateMsgType;
  daoVotingCodeId: number;
  name: string;
  description: string;
  image: LocalFileData;
  instantiateLabel: string;
  sender: string;
  tns: string;
  network: CosmosNetworkInfo;
  contractAddress: string;
  fee: number | StdFee | "auto";
  memo?: string;
  funds?: Coin[];
  onStepChange: (step: number) => Promise<void> | void;
  userOwnsName: boolean;
  userIPFSKey?: string;
}): CreateDaoResult => {
  if (!network.daoPreProposeSingleCodeId || !network.daoProposalSingleCodeId)
    return;

  await onStepChange(0);

  // ============== STEP 1 ================================================================
  const dao_pre_propose_single_msg: InstantiateMsgPrePropose = {
    deposit_info: null,
    extension: {},
    open_proposal_submission: false,
  };

  const dao_proposal_single_msg: InstantiateMsgProposalSingle = {
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
          code_id: network.daoPreProposeSingleCodeId,
          msg: Buffer.from(JSON.stringify(dao_pre_propose_single_msg)).toString(
            "base64"
          ),
          admin: { core_module: {} },
          label: `DAO_${name}_pre-propose-DaoProposalSingle`,
        },
      },
    },
  };
  const proposal_modules_instantiate_info: ModuleInstantiateInfo[] = [
    {
      admin: { core_module: {} },
      code_id: network.daoProposalSingleCodeId,
      label: `DAO_${name}_DAOProposalSingle`,
      msg: Buffer.from(JSON.stringify(dao_proposal_single_msg)).toString(
        "base64"
      ),
    },
  ];
  const voting_module_instantiate_info: ModuleInstantiateInfo = {
    admin: { core_module: {} },
    code_id: daoVotingCodeId!,
    label: instantiateLabel,
    msg: Buffer.from(JSON.stringify(daoVotingMsg)).toString("base64"),
  };

  // ======= Store the DAO image to IPFS
  const userId = getUserId(network.id, sender);
  const uploadedImage = await uploadFileToIPFS(
    image,
    network.id,
    userId,
    userIPFSKey
  );
  let imageUrl = "";
  if (!uploadedImage?.url) {
    console.error("Upload DAO image err : Fail to pin to IPFS");
  } else {
    imageUrl = ipfsURLToHTTPURL(uploadedImage?.url);
  }

  const dao_core_instantiate_msg: InstantiateMsgCore = {
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
    JSON.stringify(dao_core_instantiate_msg)
  ).toString("base64");

  if (!network.nameServiceContractAddress) {
    console.error("no name service contract address");
    return;
    // throw new Error("no name service contract address");
  }

  const client = await getKeplrSigningCosmWasmClient(network.id);

  const nameServiceClient = new TeritoriNameServiceClient(
    client,
    sender,
    network.nameServiceContractAddress
  );

  // ======= Getting the name from Name Service
  const tokenId = tns.includes(".tori") ? tns : tns + ".tori";

  try {
    if (userOwnsName) {
      // To let the user use a owned name, we burn it to release it
      const nameServiceNftInfo = await nameServiceClient.nftInfo({ tokenId });
      if (nameServiceNftInfo) await nameServiceClient.burn({ tokenId });
    }

    const amount = await nameServiceClient.mintPrice({
      // TODO: handle more TLD later
      tokenId,
    });

    const denom = getStakingCurrency(network.id)?.denom;
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
      amount && denom ? [{ denom, amount }] : []
    );

    await onStepChange(1);

    // ============== STEP 2 ================================================================
    const executeResult = await client.execute(
      sender,
      contractAddress,
      {
        instantiate_contract_with_self_admin: {
          code_id: network.daoCoreCodeId,
          instantiate_msg,
          label: name,
        },
      },
      fee,
      memo,
      funds
    );
    const daoAddress = executeResult.logs
      .find((l) => l.events.find((e) => e.type === "instantiate"))
      ?.events.find((e) => e.type === "instantiate")
      ?.attributes.find((a) => a.key === "_contract_address")?.value;
    if (!daoAddress) {
      console.error("No DAO address in transaction results");
      return;
      // throw new Error("No DAO address in transaction results");
    }

    await onStepChange(2);

    // ============== STEP 3 ================================================================
    // ======= Transferring the name from Name Service
    await nameServiceClient.transferNft({
      recipient: daoAddress,
      tokenId,
    });
    await onStepChange(3);

    return { daoAddress, executeResult };
  } catch (e) {
    console.error("Error creating DAO: ", e);
  }
};
