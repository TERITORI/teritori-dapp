import { SigningStargateClient } from "@cosmjs/stargate";

import { getNativeWallet } from "./getNativeWallet";
import { mustGetCosmosNetwork } from "../../../networks";

export const useNativeSigner = async () => {
  const networkId = "teritori";
  const network = mustGetCosmosNetwork(networkId);

  const wallet = await getNativeWallet();
  const rpcEndpoint = network.rpcEndpoint;
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
  );
  if (!client) {
    throw new Error("Native Wallet not ready");
  }

  return client;
};
