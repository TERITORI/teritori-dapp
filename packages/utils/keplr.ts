import { Window as KeplrWindow } from "@keplr-wallet/types";
import { CosmWasmClient, SigningCosmWasmClient } from "cosmwasm";

import { teritoriGasPrice } from "./teritori";

const PUBLIC_RPC_ENDPOINT = process.env.PUBLIC_CHAIN_RPC_ENDPOINT || "";
const PUBLIC_CHAIN_ID = process.env.PUBLIC_CHAIN_ID;

export function isKeplrInstalled() {
  return !!(window as KeplrWindow)?.keplr;
}

export const getKeplrOfflineSigner = () => {
  if (!isKeplrInstalled()) {
    throw new Error("keplr not installed");
  }

  return (window as KeplrWindow).keplr.getOfflineSigner(PUBLIC_CHAIN_ID);
};

export const getKeplrAccounts = async () => {
  const offlineSigner = getKeplrOfflineSigner();

  return offlineSigner.getAccounts();
};

export const getFirstKeplrAccount = async () => {
  const keplrAccounts = await getKeplrAccounts();

  if (!keplrAccounts.length) {
    throw new Error("no keplr accounts");
  }

  return keplrAccounts[0];
};

export const getSigningCosmWasmClient = async () => {
  const offlineSigner = getKeplrOfflineSigner();

  return SigningCosmWasmClient.connectWithSigner(
    PUBLIC_RPC_ENDPOINT,
    offlineSigner,
    { gasPrice: teritoriGasPrice }
  );
};

export const getNonSigningCosmWasmClient = () =>
  CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT);
