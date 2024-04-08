import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { getNativeWallet } from "./getNativeWallet";

import { mustGetCosmosNetwork } from "@/networks";
import { StoreWallet } from "@/utils/types/wallet";

export const getNativeSigner = async (selectedWallet: StoreWallet) => {
  const network = mustGetCosmosNetwork(selectedWallet.networkId);

  const wallet = await getNativeWallet(
    network.addressPrefix,
    selectedWallet.index,
  );
  const rpcEndpoint = network.rpcEndpoint;
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
  );
  if (!client) {
    throw new Error("Native Wallet not ready");
  }

  return client;
};
