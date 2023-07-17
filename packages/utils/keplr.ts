import { StdSignature } from "@cosmjs/amino";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Window as KeplrWindow } from "@keplr-wallet/types";

import { mustGetCosmosNetwork, parseUserId } from "../networks";

const PUBLIC_RPC_ENDPOINT = process.env.PUBLIC_CHAIN_RPC_ENDPOINT || "";

export function isKeplrInstalled() {
  return !!(window as KeplrWindow)?.keplr;
}

export const getKeplr = () => {
  const keplrWindow = window as KeplrWindow;
  if (!keplrWindow.keplr) {
    throw new Error("keplr not installed");
  }
  return keplrWindow.keplr;
};

export const getNonSigningCosmWasmClient = () =>
  CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT);

export const keplrSignArbitrary = async (
  userId: string,
  data: string | Uint8Array
) => {
  const keplr = getKeplr();
  const [network, signerAddress] = parseUserId(userId);
  const cosmosNetwork = mustGetCosmosNetwork(network?.id);
  const signature = await keplr.signArbitrary(
    cosmosNetwork.chainId,
    signerAddress,
    data
  );
  return signature;
};

export const keplrVerifyArbitrary = async (
  userId: string,
  data: string | Uint8Array,
  signature: StdSignature
) => {
  const keplr = getKeplr();
  const [network, signerAddress] = parseUserId(userId);
  const cosmosNetwork = mustGetCosmosNetwork(network?.id);
  const verified = await keplr.verifyArbitrary(
    cosmosNetwork.chainId,
    signerAddress,
    data,
    signature
  );
  return verified;
};
