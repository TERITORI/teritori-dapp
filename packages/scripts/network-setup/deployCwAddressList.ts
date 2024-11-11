import { OfflineSigner } from "@cosmjs/proto-signing";
import { bech32 } from "bech32";
import { program } from "commander";
import { cloneDeep } from "lodash";
import os from "os";
import path from "path";

import { registerTNSHandle, testTeritoriEcosystem } from "./deployLib";
import { InstantiateMsg as CwAddressListInstantiateMsg } from "../../contracts-clients/cw-address-list/CwAddressList.types";

import {
  CosmosNetworkInfo,
  getCosmosNetwork,
  getNetworkFeature,
  NetworkFeature,
} from "@/networks";
import { execPromise } from "@/scripts/lib";
import {
  instantiateContract,
  storeWASM,
} from "@/scripts/network-setup/deployLib";

const deployCwAddressList = async ({
  opts,
  networkId,
  wallet,
}: {
  networkId: string;
  wallet: string;
  opts: {
    home: string;
    binaryPath: string;
    keyringBackend?: string;
    signer: OfflineSigner | undefined;
  };
}) => {
  const network = cloneDeep(getCosmosNetwork(networkId));
  if (!network) {
    console.error(`Cosmos network ${networkId} not found`);
    process.exit(1);
  }
  console.log(`Deploying to ${network.displayName}`);

  let walletAddr = (
    await execPromise(
      `${opts.binaryPath} keys show --keyring-backend ${opts.keyringBackend || "test"} -a ${wallet} --home ${opts.home}`,
      { encoding: "utf-8" },
    )
  ).stdout.trim();
  if (walletAddr.startsWith("Successfully migrated")) {
    walletAddr = walletAddr.substring(walletAddr.indexOf("\n")).trim();
  }
  bech32.decode(walletAddr);
  console.log("Wallet address:", walletAddr);

  const nftMarketplaceFeature = cloneDeep(
    getNetworkFeature(networkId, NetworkFeature.NFTMarketplace),
  );
  if (!nftMarketplaceFeature) {
    console.error(`NFT Marketplace feature not found on ${networkId}`);
    process.exit(1);
  }

  console.log("Storing cw address list");
  const cwAddressListWasmFilePath = path.join(
    process.cwd(),
    "artifacts",
    "cw_address_list.wasm",
  );
  nftMarketplaceFeature.cwAddressListCodeId = await storeWASM(
    opts,
    wallet,
    network,
    cwAddressListWasmFilePath,
  );

  console.log(
    "Instantiating cw address list",
    nftMarketplaceFeature.cwAddressListCodeId,
  );
  nftMarketplaceFeature.cwAddressListContractAddress =
    await instantiateCwAddressList(
      opts,
      wallet,
      walletAddr,
      nftMarketplaceFeature.cwAddressListCodeId,
      network,
    );

  console.log(
    "Cw address list contract instantiated",
    nftMarketplaceFeature.cwAddressListContractAddress,
  );

  network.featureObjects = network.featureObjects?.map((featureObject) => {
    if (featureObject.type === NetworkFeature.NFTMarketplace) {
      return nftMarketplaceFeature;
    } else return featureObject;
  });

  console.log(JSON.stringify(network, null, 2));

  if (opts.signer) {
    await registerTNSHandle(network, opts.signer);
    await testTeritoriEcosystem(network);
  }

  return network;
};

const instantiateCwAddressList = async (
  opts: { home: string; binaryPath: string; keyringBackend?: string },
  wallet: string,
  adminAddr: string,
  codeId: string,
  network: CosmosNetworkInfo,
) => {
  const instantiateMsg: CwAddressListInstantiateMsg = { admin: adminAddr };
  return await instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori CW Address List",
    instantiateMsg,
  );
};

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.option("--keyring-backend [keyring-backend]", "Keyring backend");
  program.parse();
  const [networkId, wallet] = program.args;
  const { keyringBackend } = program.opts();

  await deployCwAddressList({
    opts: {
      home: path.join(os.homedir(), ".teritorid"),
      binaryPath: "teritorid",
      keyringBackend,
      signer: undefined,
    },
    networkId,
    wallet,
  });
};
main();

