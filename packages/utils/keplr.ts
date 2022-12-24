import {Window as KeplrWindow} from "@keplr-wallet/types";
import {CosmWasmClient, SigningCosmWasmClient} from "cosmwasm";

import {allNetworks, isTestMode, NetworkInfo} from "../networks";
import {teritoriGasPrice} from "./teritori";
import {NetworkName} from "../networks/NetworkName";

const PUBLIC_RPC_ENDPOINT = process.env.PUBLIC_CHAIN_RPC_ENDPOINT || "";
const PUBLIC_CHAIN_ID = process.env.PUBLIC_CHAIN_ID || "";

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

export const getKeplrOfflineSigner = (network?: NetworkInfo) => {
  return getKeplr().getOfflineSignerAuto(
    network ? network.chainId : PUBLIC_CHAIN_ID
  );
};

export const getKeplrAccounts = async (network?: NetworkInfo) => {
  const offlineSigner = await getKeplrOfflineSigner(network);

  return offlineSigner.getAccounts();
};

export const getFirstKeplrAccount = async (network?: NetworkInfo) => {
  const keplrAccounts = await getKeplrAccounts(network);

  if (!keplrAccounts.length) {
    throw new Error("no keplr accounts");
  }

  return keplrAccounts[0];
};

export const getSigningCosmWasmClient = async (network?: NetworkInfo) => {
  const offlineSigner = await getKeplrOfflineSigner(network);

  return SigningCosmWasmClient.connectWithSigner(
    network?.rpcEndpoint || PUBLIC_RPC_ENDPOINT,
    offlineSigner,
    { gasPrice: teritoriGasPrice }
  );
};

export const getNonSigningCosmWasmClient = (network?: NetworkInfo) =>
  CosmWasmClient.connect(network?.rpcEndpoint || PUBLIC_RPC_ENDPOINT);
