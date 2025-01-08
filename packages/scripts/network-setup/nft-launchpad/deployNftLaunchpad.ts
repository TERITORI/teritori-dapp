import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { cloneDeep } from "lodash";
import path from "path";

import { deployCwAdminFactory } from "../cw-admin-factory/deployCwAdminFactory";
import { deployDA0DA0 } from "../dao-dao/deployDA0DA0";
import {
  DeployOpts,
  initDeploy,
  instantiateContract,
  storeWASM,
} from "../deployLib";

import { DaoCoreQueryClient } from "@/contracts-clients/dao-core/DaoCore.client";
import { InstantiateMsg as NftLaunchpadInstantiateMsg } from "@/contracts-clients/nft-launchpad/NftLaunchpad.types";
import { TeritoriNameServiceClient } from "@/contracts-clients/teritori-name-service/TeritoriNameService.client";
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
  signingCosmWasmClient,
  nameServiceClient,
  opts,
  networkId,
  wallet,
}: {
  signingCosmWasmClient: SigningCosmWasmClient;
  nameServiceClient: TeritoriNameServiceClient;
  networkId: string;
  wallet: string;
  opts: DeployOpts;
}) => {
  const { network, walletAddr: deployerWalletAddress } = await initDeploy({
    opts,
    networkId,
    wallet,
  });

  // Getting the feature
  const cosmwasmLaunchpadFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.CosmWasmNFTLaunchpad),
  );
  if (!cosmwasmLaunchpadFeature) {
    console.error(`Cosmwasm Launchpad feature not found on ${networkId}`);
    process.exit(1);
  }

  // Optimizing contract and getting WASM binaries
  console.log("Storing nft launchpad");
  const nftLaunchpadWasmFilePath = path.join(
    __dirname,
    "../../../../artifacts/nft_launchpad.wasm",
  );
  cosmwasmLaunchpadFeature.codeId = await storeWASM(
    opts,
    wallet,
    network,
    nftLaunchpadWasmFilePath,
  );

  // Next steps
  console.log("Instantiating nft launchpad", cosmwasmLaunchpadFeature.codeId);
  const launchpadContractAddress = await instantiateNftLaunchpad({
    signingCosmWasmClient,
    nameServiceClient,
    opts,
    wallet,
    deployerWalletAddress,
    network,
    featureObject: cosmwasmLaunchpadFeature,
  });
  if (launchpadContractAddress)
    cosmwasmLaunchpadFeature.launchpadContractAddress =
      launchpadContractAddress;

  // Updating the network with the updated feature
  network.featureObjects = network.featureObjects?.map((featureObject) => {
    if (featureObject.type === NetworkFeature.CosmWasmNFTLaunchpad) {
      return cosmwasmLaunchpadFeature;
    } else return featureObject;
  });

  console.log(JSON.stringify(network, null, 2));
  return network;
};

const instantiateNftLaunchpad = async ({
  signingCosmWasmClient,
  nameServiceClient,
  opts,
  wallet,
  deployerWalletAddress,
  network,
  featureObject,
}: {
  signingCosmWasmClient: SigningCosmWasmClient;
  nameServiceClient: TeritoriNameServiceClient;
  opts: DeployOpts;
  wallet: string;
  deployerWalletAddress: string;
  network: CosmosNetworkInfo;
  featureObject: CosmWasmNFTLaunchpad;
}) => {
  const codeId = featureObject.codeId;
  if (!codeId) {
    console.error("Nft Launchpad code ID not found");
    process.exit(1);
  }
  console.log("Nft Launchpad code ID found:", codeId);

  // NFT TR721
  let nftCodeId = featureObject.nftTr721CodeId;
  if (!nftCodeId) {
    console.error("No NFT TR721 code ID found. Deploying NFT TR721 ...");
    nftCodeId = await deployNftTr721({
      opts,
      networkId: network.id,
      wallet,
    });
  }
  console.log("NFT TR721 deployed:", nftCodeId);

  // CW ADMIN FACTORY
  if (!network.cwAdminFactoryContractAddress) {
    console.error(
      "No CW ADMIN FACTORY contract found. Instantiating CW ADMIN FACTORY ...",
    );
    network = await deployCwAdminFactory({
      opts,
      networkId: network.id,
      wallet,
    });
  }
  console.log(
    "CW ADMIN FACTORY deployed:",
    network.cwAdminFactoryContractAddress,
  );

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
      wallet,
    });
  }
  console.log("DA0DA0 stuff deployed");

  console.log("Creating the Launchpad Admin DAO");
  const params: CreateDaoMemberBasedParams = {
    signingCosmWasmClient,
    nameServiceClient,
    networkId: network.id,
    sender: deployerWalletAddress,
    contractAddress: network.cwAdminFactoryContractAddress!,
    daoCoreCodeId: network.daoCoreCodeId!,
    daoPreProposeSingleCodeId: network.daoPreProposeSingleCodeId!,
    daoProposalSingleCodeId: network.daoProposalSingleCodeId!,
    cw4GroupCodeId: network.cw4GroupCodeId!,
    daoVotingCw4CodeId: network.daoVotingCw4CodeId!,
    name: "Launchpad Admin",
    description: "The DAO who reviews applied collections",
    tns: "dao-" + randomTnsName(),
    imageUrl: "",
    members: [
      {
        addr: deployerWalletAddress,
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
  const daoCoreClient = new DaoCoreQueryClient(
    signingCosmWasmClient,
    daoAddress,
  );
  const daoProposalSingleModule = (
    await daoCoreClient.activeProposalModules({})
  )[0];
  const daoProposalSingleContractAddress = daoProposalSingleModule.address;
  console.log(
    "DAO Proposal Single contract used:",
    daoProposalSingleContractAddress,
  );

  const instantiateMsg: NftLaunchpadInstantiateMsg = {
    config: {
      name: "Teritori NFT Launchpad",
      owner: deployerWalletAddress,
      admin: daoAddress,
      nft_code_id: nftCodeId,
      proposal_single_contract: daoProposalSingleContractAddress,
    },
  };
  return await instantiateContract(
    opts,
    deployerWalletAddress,
    network,
    codeId,
    deployerWalletAddress,
    "Teritori NFT Launchpad",
    instantiateMsg,
  );
};

const deployNftTr721 = async ({
  opts,
  networkId,
  wallet,
}: {
  networkId: string;
  wallet: string;
  opts: DeployOpts;
}) => {
  const { network, walletAddr: deployerWalletAddress } = await initDeploy({
    opts,
    networkId,
    wallet,
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
    deployerWalletAddress,
    network,
    nftTr721WasmFilePath,
  );
  return cosmwasmLaunchpadFeature.nftTr721CodeId;
};

const randomTnsName = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
