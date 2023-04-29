import { Window as KeplrWindow } from "@keplr-wallet/types";

export function isKeplrExtensionInstalled() {
  return !!(window as KeplrWindow)?.keplr;
}

export const getKeplrExtension = () => {
  const keplrWindow = window as KeplrWindow;
  if (!keplrWindow.keplr) {
    throw new Error("keplr not installed");
  }
  return keplrWindow.keplr;
};
