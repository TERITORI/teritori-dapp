import { Window as KeplrWindow } from "@keplr-wallet/types";

import { mustGetCosmosNetwork, parseUserId } from "../networks";

export const getKeplr = () => {
  const keplrWindow = window as KeplrWindow;
  if (!keplrWindow.keplr) {
    throw new Error("keplr not installed");
  }
  return keplrWindow.keplr;
};

export const keplrSignArbitrary = async (
  userId: string,
  data: string | Uint8Array,
) => {
  const keplr = getKeplr();
  const [network, signerAddress] = parseUserId(userId);
  const cosmosNetwork = mustGetCosmosNetwork(network?.id);
  const signature = await keplr.signArbitrary(
    cosmosNetwork.chainId,
    signerAddress,
    data,
  );
  return signature;
};
