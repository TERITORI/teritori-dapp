import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { getNativeWallet } from "./getNativeWallet";

import { mustGetCosmosNetwork } from "@/networks";
import { StoreWallet } from "@/store/slices/wallets";

export const getNativeSigner = async (selectedWallet: StoreWallet) => {
  const network = mustGetCosmosNetwork(selectedWallet.networkId);

  const wallet = await getNativeWallet("tori", selectedWallet.index);
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
