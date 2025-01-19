import { cloneDeep } from "lodash";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { deployCwAdminFactory } from "../cw-admin-factory/deployCwAdminFactory";
import { deployDA0DA0 } from "../dao-dao/deployDA0DA0";
import { deployDaoProposalSingle } from "../dao-dao/deployDaoProposalSingle";
import {
  DeployOpts,
  initDeploy,
  instantiateContract,
  storeWASM,
} from "../deployLib";

import { InstantiateMsg as NftLaunchpadInstantiateMsg } from "@/contracts-clients/nft-launchpad";
import {
  CosmosNetworkInfo,
  getNetworkFeature,
  NetworkFeature,
} from "@/networks";
import { CosmWasmNFTLaunchpad } from "@/networks/features";
import { createDaoMemberBased, CreateDaoMemberBasedParams } from "@/utils/dao";
import { getPercent, getDuration } from "@/utils/gnodao/helpers";

/**
 * Store nft-launchpad binaries
 * Deploy nft-tr721
 * Deploy and instantiate cw-admin-factory
 * Deploy and instantiate DAODA0 stuff (See deployDA0DA0.ts)
 * Create the Launchpad Admin DAO
 * Deploy and instantiate DAO Proposal Single module from https://github.com/DA0-DA0/dao-contracts (We consider using the v2.2.0)
 * Deploy and instantiate nft-launchpad
 */
export const deployNftLaunchpad = async ({
  opts,
  networkId,
  wallet: deployerWallet,
}: {
  networkId: string;
  wallet: string;
  opts: DeployOpts;
}) => {
  const { network, walletAddr: deployerAddr } = await initDeploy({
    opts,
    networkId,
    wallet: deployerWallet,
  });

  const cosmwasmLaunchpadFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.CosmWasmNFTLaunchpad),
  );
  if (!cosmwasmLaunchpadFeature) {
    console.error(`Cosmwasm Launchpad feature not found on ${networkId}`);
    process.exit(1);
  }
  console.log("Storing nft launchpad");
  const nftLaunchpadWasmFilePath = path.join(
    __dirname,
    "../../../artifacts/nft_launchpad.wasm",
  );
  cosmwasmLaunchpadFeature.codeId = await storeWASM(
    opts,
    deployerWallet,
    network,
    nftLaunchpadWasmFilePath,
  );

  console.log("Instantiating nft launchpad", cosmwasmLaunchpadFeature.codeId);
  const launchpadContractAddress = await instantiateNftLaunchpad(
    opts,
    deployerWallet,
    deployerAddr,
    network,
    cosmwasmLaunchpadFeature,
  );
  if (launchpadContractAddress)
    cosmwasmLaunchpadFeature.launchpadContractAddress =
      launchpadContractAddress;

  network.featureObjects = network.featureObjects?.map((featureObject) => {
    if (featureObject.type === NetworkFeature.CosmWasmNFTLaunchpad) {
      return cosmwasmLaunchpadFeature;
    } else return featureObject;
  });

  console.log(JSON.stringify(network, null, 2));
  return network;
};

const instantiateNftLaunchpad = async (
  opts: DeployOpts,
  deployerWallet: string,
  deployerAddr: string,
  network: CosmosNetworkInfo,
  featureObject: CosmWasmNFTLaunchpad,
) => {
  const codeId = featureObject.codeId;
  if (!codeId) {
    console.error("Nft Launchpad code ID not found");
    process.exit(1);
  }

  // NFT TR721
  let nftCodeId = featureObject.nftTr721CodeId;
  if (!nftCodeId) {
    console.error("No NFT TR721 code ID found. Deploying NFT TR721 ...");
    nftCodeId = await deployNftTr721({
      opts,
      networkId: network.id,
      deployerWallet,
    });
  }

  // CW ADMIN FACTORY
  if (!network.cwAdminFactoryContractAddress) {
    console.error(
      "No CW ADMIN FACTORY contract found. Instantiating CW ADMIN FACTORY ...",
    );
    network = await deployCwAdminFactory({
      opts,
      networkId: network.id,
      wallet: deployerWallet,
    });
  }

  // DA0DA0
  if (
    !network.daoCoreCodeId ||
    !network.daoPreProposeSingleCodeId ||
    !network.daoProposalSingleCodeId ||
    !network.cw4GroupCodeId ||
    !network.daoVotingCw4CodeId
  ) {
    console.error("No DA0DA0 stuff found. Deploying DA0DA0 stuff ...");
    network = await deployDA0DA0({
      opts,
      networkId: network.id,
      wallet: deployerWallet,
    });
  }

  console.log("Creating the Launchpad Admin DAO");
  const params: CreateDaoMemberBasedParams = {
    networkId: network.id,
    sender: deployerAddr,
    contractAddress: network.cwAdminFactoryContractAddress!,
    daoCoreCodeId: network.daoCoreCodeId!,
    daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
    daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
    cw4GroupCodeId: network.cw4GroupCodeId!,
    daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
    name: "Launchpad Admin",
    description: "The DAO who reviews applied collections",
    tns: "dao-" + uuidv4(),
    imageUrl: "???????",
    members: [
      {
        addr: deployerAddr,
        weight: 1,
      },
    ],
    quorum: getPercent(50),
    threshold: getPercent(15),
    maxVotingPeriod: getDuration("1", "0", "0"),
  };
  const { daoAddress, executeResult } = await createDaoMemberBased(
    params,
    "auto",
  );

  if (executeResult) {
    console.log("Launchpad Admin DAO created: " + daoAddress);
  } else {
    console.error(
      "Failed to create Launchpad Admin DAO.\nNFT Launchpad contract instantiation aborted.",
    );
    return null;
  }

  // dao-proposal-single
  let daoProposalSingleContractAddress =
    featureObject.daoProposalSingleContractAddress;
  if (!daoProposalSingleContractAddress) {
    console.error(
      "No DAO Proposal Single contract address found. Instantiating DAO Proposal Single...",
    );
    daoProposalSingleContractAddress = await instantiateDaoProposalSingle({
      opts,
      deployerWallet,
      adminAddr: daoAddress,
      network,
    });
  }

  const instantiateMsg: NftLaunchpadInstantiateMsg = {
    config: {
      name: "Teritori NFT Launchpad",
      owner: deployerAddr,
      admin: daoAddress,
      nft_code_id: nftCodeId,
      proposal_single_contract: daoProposalSingleContractAddress,
    },
  };
  return await instantiateContract(
    opts,
    deployerWallet,
    network,
    codeId,
    deployerAddr,
    "Teritori NFT Launchpad",
    instantiateMsg,
  );
};

const instantiateDaoProposalSingle = async ({
  opts,
  deployerWallet,
  adminAddr,
  network,
}: {
  opts: DeployOpts;
  deployerWallet: string;
  adminAddr: string;
  network: CosmosNetworkInfo;
}) => {
  let codeId = network.daoProposalSingleCodeId;
  if (!codeId) {
    console.error(
      "No DAO Proposal Single code ID. Deploying DAO Proposal Single...",
    );
    codeId = await deployDaoProposalSingle({
      opts,
      network,
      wallet: deployerWallet,
    });
  }
  return await instantiateContract(
    opts,
    deployerWallet,
    network,
    codeId,
    adminAddr,
    "Teritori DAO Proposal Single",
    {},
  );
};

const deployNftTr721 = async ({
  opts,
  networkId,
  deployerWallet,
}: {
  networkId: string;
  deployerWallet: string;
  opts: DeployOpts;
}) => {
  const { network } = await initDeploy({
    opts,
    networkId,
    wallet: deployerWallet,
  });
  const cosmwasmLaunchpadFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.CosmWasmNFTLaunchpad),
  );
  if (!cosmwasmLaunchpadFeature) {
    console.error(`Cosmwasm Launchpad feature not found on ${networkId}`);
    process.exit(1);
  }
  const nftTr721WasmFilePath = path.join(__dirname, "nft_tr721.wasm");
  cosmwasmLaunchpadFeature.nftTr721CodeId = await storeWASM(
    opts,
    deployerWallet,
    network,
    nftTr721WasmFilePath,
  );
  return cosmwasmLaunchpadFeature.nftTr721CodeId;
};
