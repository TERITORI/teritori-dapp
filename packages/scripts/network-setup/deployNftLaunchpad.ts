import { program } from "commander";
import { cloneDeep } from "lodash";
import os from "os";
import path from "path";

import { InstantiateMsg as NftLaunchpadInstantiateMsg } from "@/contracts-clients/nft-launchpad";
import {
  allNetworks,
  CosmosNetworkInfo,
  getNetworkFeature,
  NetworkFeature,
} from "@/networks";
import { CosmWasmLaunchpad } from "@/networks/features";
import {
  DeployProps,
  initDeploy,
  instantiateContract,
  storeWASM,
} from "@/scripts/network-setup/deployLib";

export const deployNftLaunchpad = async ({
  opts,
  networkId,
  wallet,
}: DeployProps) => {
  const { network, walletAddr } = await initDeploy({ opts, networkId, wallet });

  const cosmwasmLaunchpadFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.NFTLaunchpad),
  );
  if (!cosmwasmLaunchpadFeature) {
    console.error(`Cosmwasm Launchpad feature not found on ${networkId}`);
    process.exit(1);
  }
  console.log("Storing nft launchpad");
  const nftLaunchpadWasmFilePath = path.join(__dirname, "nft_launchpad.wasm");
  cosmwasmLaunchpadFeature.codeId = await storeWASM(
    opts,
    wallet,
    network,
    nftLaunchpadWasmFilePath,
  );

  console.log("Instantiating nft launchpad", cosmwasmLaunchpadFeature.codeId);
  cosmwasmLaunchpadFeature.launchpadContractAddress =
    await instantiateNftLaunchpad(
      opts,
      wallet,
      walletAddr,
      network,
      cosmwasmLaunchpadFeature,
    );
  network.featureObjects = network.featureObjects?.map((featureObject) => {
    if (featureObject.type === NetworkFeature.NFTLaunchpad) {
      return cosmwasmLaunchpadFeature;
    } else return featureObject;
  });
};

export const instantiateNftLaunchpad = async (
  opts: { home: string; binaryPath: string },
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
  featureObject: CosmWasmLaunchpad,
) => {
  const codeId = featureObject.codeId;
  if (!codeId) {
    throw new Error("Nft Launchpad code ID not found");
  }
  const instantiateMsg: NftLaunchpadInstantiateMsg = {
    config: {
      name: "Teritori NFT Launchpad",
      supported_networks: allNetworks
        .filter((n) => n.features.includes(NetworkFeature.NFTLaunchpad))
        .map((n) => n.id),
    },
  };
  return await instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori NFT Launchpad",
    instantiateMsg,
  );
};

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet] = program.args;
  // const { keyringBackend } = program.opts();

  await deployNftLaunchpad({
    opts: {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      // keyringBackend,
      signer: undefined,
    },
    networkId,
    wallet,
  });
};
main();
