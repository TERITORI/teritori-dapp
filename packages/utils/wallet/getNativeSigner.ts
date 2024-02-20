import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { getNativeWallet } from "./getNativeWallet";

import { mustGetCosmosNetwork } from "@/networks";
// eslint-disable-next-line no-restricted-imports
import { StoreWallet } from "@/store/slices/wallets";

export const getNativeSigner = async (selectedWallet: StoreWallet) => {
  const network = mustGetCosmosNetwork(selectedWallet.networkId);

  const wallet = await getNativeWallet(network.idPrefix, selectedWallet.index);
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
