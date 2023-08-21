import { DeliverTxResponse, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate/build/modules";
import { toUtf8 } from "@cosmjs/encoding";
import { Coin, StdFee } from "@cosmjs/stargate";

import { ipfsURLToHTTPURL, uploadFileToIPFS } from "./ipfs";
import { LocalFileData } from "./types/files";
import { TransferNftMsg } from "./types/nft";
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
  MintMsgForMetadata,
  UpdateMetadataMsg,
} from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import {
  CosmosNetworkInfo,
  getKeplrSigningCosmWasmClient,
  getStakingCurrency,
  getUserId,
  mustGetCosmosNetwork,
} from "../networks";

export interface TokenHolder {
  address: string;
  amount: string;
}
type CreateDaoResult = Promise<
  | {
      daoAddress: string;
      daoCreationResult: ExecuteResult;
      nameServiceTxResponse: DeliverTxResponse;
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
    nsTokenId,
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
    nsTokenId: string;
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
  // TODO: handle more networks later (Gno)
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
    nsTokenId,
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
    nsTokenId,
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
    nsTokenId: string;
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
  // TODO: handle more networks later (Gno)
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
    nsTokenId,
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
    nsTokenId,
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
    nsTokenId: string;
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
  // TODO: handle more networks later (Gno)
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
    nsTokenId,
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
  nsTokenId,
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
  nsTokenId: string;
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
  const tokenId = nsTokenId;

  await onStepChange(0);

  // We need some DAO client stuff
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

  try {
    // ============== STEP 1 ================================================================
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
    }

    const client = await getKeplrSigningCosmWasmClient(network.id);

    // ======= Creating the DAO
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
    }
    await onStepChange(1);

    // ============== STEP 2 ================================================================
    // ======= Getting a Name from Name Service
    const nameServiceClient = new TeritoriNameServiceClient(
      client,
      sender,
      network.nameServiceContractAddress
    );
    let msg1: MsgExecuteContractEncodeObject;
    // If the user provides a not owned Name, we just mint the nft
    if (!userOwnsName) {
      const amount = await nameServiceClient.mintPrice({
        tokenId,
      });
      const denom = getStakingCurrency(network.id)?.denom;
      const mintMessage: MintMsgForMetadata = {
        owner: sender,
        token_id: tokenId,
        extension: {
          public_name: name,
          image: imageUrl,
          public_bio: description,
        },
      };
      msg1 = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          msg: toUtf8(
            JSON.stringify({
              mint: mintMessage,
            })
          ),
          funds: amount && denom ? [{ denom, amount }] : [],
          contract: network.nameServiceContractAddress,
        },
      };
    }
    // If the user provides an owned Name, we update the image, desc and public name with the DAO info
    else {
      const nftInfo = await nameServiceClient.nftInfo({
        tokenId,
      });

      const updateMetadataMsg: UpdateMetadataMsg = {
        token_id: tokenId,
        metadata: {
          ...nftInfo.extension,
          image: imageUrl,
          public_bio: description,
          public_name: name,
        },
      };
      msg1 = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender,
          msg: toUtf8(
            JSON.stringify({
              update_metadata: updateMetadataMsg,
              // fee: "auto",
            })
          ),
          funds: [],
          contract: network.nameServiceContractAddress,
        },
      };
    }

    // ======= Transferring the Name from Name Service
    const transferNftMsg: TransferNftMsg = {
      recipient: daoAddress,
      token_id: tokenId,
    };
    const msg2: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender,
        msg: toUtf8(
          JSON.stringify({
            transfer_nft: transferNftMsg,
          })
        ),
        funds: [],
        contract: network.nameServiceContractAddress,
      },
    };

    // We broadcast Name Service TXs
    const txResponse = await client.signAndBroadcast(
      sender,
      [msg1, msg2],
      "auto"
    );
    await onStepChange(2);

    return {
      daoAddress,
      daoCreationResult: executeResult,
      nameServiceTxResponse: txResponse,
    };
  } catch (e) {
    console.error("Error while DAO creation: ", e);
  }
};
