import { Window as KeplrWindow } from "@keplr-wallet/types";
import { CosmWasmClient } from "cosmwasm";

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
