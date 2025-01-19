import { bech32 } from "bech32";
import { cloneDeep } from "lodash";
import path from "path";

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

export const deployCwAddressList = async ({
  opts,
  networkId,
  wallet,
}: {
  networkId: string;
  wallet: string;
  opts: { home: string; binaryPath: string; keyringBackend?: string };
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

  if (!nftMarketplaceFeature.cwAddressListContractAddress) {
    console.log("Storing cw address list");
    const cwAddressListWasmFilePath = path.join(
      __dirname,
      "cw_address_list.wasm",
    );
    network.cwAddressListCodeId = await storeWASM(
      opts,
      wallet,
      network,
      cwAddressListWasmFilePath,
    );

    console.log("Instantiating cw address list", network.cwAddressListCodeId);
    nftMarketplaceFeature.cwAddressListContractAddress =
      await instantiateCwAddressList(opts, wallet, walletAddr, network);

    network.featureObjects = network.featureObjects?.map((featureObject) => {
      if (featureObject.type === NetworkFeature.NFTMarketplace) {
        return nftMarketplaceFeature;
      } else return featureObject;
    });
  }
};

const instantiateCwAddressList = async (
  opts: { home: string; binaryPath: string; keyringBackend?: string },
  wallet: string,
  adminAddr: string,
  network: CosmosNetworkInfo,
) => {
  const codeId = network.cwAddressListCodeId;
  if (!codeId) {
    throw new Error("CW Address List code ID not found");
  }
  return await instantiateContract(
    opts,
    wallet,
    network,
    codeId,
    adminAddr,
    "Teritori CW Address List",
    {},
  );
};
