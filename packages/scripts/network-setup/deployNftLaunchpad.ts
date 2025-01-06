import { program } from "commander";
import { cloneDeep } from "lodash";
import os from "os";
import path from "path";

import { InstantiateMsg as NftLaunchpadInstantiateMsg } from "@/contracts-clients/nft-launchpad";
import {
  CosmosNetworkInfo,
  getNetworkFeature,
  NetworkFeature,
} from "@/networks";
import { CosmWasmNFTLaunchpad } from "@/networks/features";
import {
  DeployOpts,
  initDeploy,
  instantiateContract,
  storeWASM,
} from "@/scripts/network-setup/deployLib";

const deployNftLaunchpad = async ({
  opts,
  networkId,
  wallet: deployerWallet,
  launchpadAdmin,
}: {
  networkId: string;
  wallet: string;
  launchpadAdmin: string;
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
  const nftLaunchpadWasmFilePath = path.join(__dirname, "nft_launchpad.wasm");
  cosmwasmLaunchpadFeature.codeId = await storeWASM(
    opts,
    deployerWallet,
    network,
    nftLaunchpadWasmFilePath,
  );

  console.log("Instantiating nft launchpad", cosmwasmLaunchpadFeature.codeId);
  cosmwasmLaunchpadFeature.launchpadContractAddress =
    await instantiateNftLaunchpad(
      opts,
      deployerWallet,
      deployerAddr,
      launchpadAdmin,
      network,
      cosmwasmLaunchpadFeature,
    );
  network.featureObjects = network.featureObjects?.map((featureObject) => {
    if (featureObject.type === NetworkFeature.CosmWasmNFTLaunchpad) {
      return cosmwasmLaunchpadFeature;
    } else return featureObject;
  });
};

export const instantiateNftLaunchpad = async (
  opts: DeployOpts,
  deployerWallet: string,
  deployerAddr: string,
  launchpadAdmin: string,
  network: CosmosNetworkInfo,
  featureObject: CosmWasmNFTLaunchpad,
) => {
  const codeId = featureObject.codeId;
  if (!codeId) {
    console.error("Nft Launchpad code ID not found");
    process.exit(1);
  }
  let nftCodeId = featureObject.nftTr721CodeId;
  if (!nftCodeId) {
    nftCodeId = await deployNftTr721({
      opts,
      networkId: network.id,
      deployerWallet,
    });
  }
  const instantiateMsg: NftLaunchpadInstantiateMsg = {
    config: {
      name: "Teritori NFT Launchpad",
      owner: deployerAddr,
      admin: launchpadAdmin,
      nft_code_id: nftCodeId,
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

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.argument(
    "<launchpad-admin>",
    "The DAO wallet adress to make admin things",
  );
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet, launchpadAdmin] = program.args;
  const { keyringBackend } = program.opts();

  await deployNftLaunchpad({
    opts: {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
    },
    networkId,
    wallet,
    launchpadAdmin,
  });
};
main();
