import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Window as KeplrWindow } from "@keplr-wallet/types";

import { teritoriGasPrice } from "./teritori";

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

export const getKeplrOfflineSigner = () => {
  return getKeplr().getOfflineSignerAuto(PUBLIC_CHAIN_ID);
};

export const getSigningCosmWasmClient = async () => {
  const offlineSigner = await getKeplrOfflineSigner();

  return SigningCosmWasmClient.connectWithSigner(
    PUBLIC_RPC_ENDPOINT,
    offlineSigner,
    { gasPrice: teritoriGasPrice }
  );
};
