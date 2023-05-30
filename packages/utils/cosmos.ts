import { bech32 } from "bech32";

import { getCosmosNetwork } from "../networks";

export const convertCosmosAddress = (
  sourceAddress: string | undefined,
  targetNetworkId: string | undefined
) => {
  if (!sourceAddress) {
    return undefined;
  }
  const targetNetwork = getCosmosNetwork(targetNetworkId);
  if (!targetNetwork) {
    return undefined;
  }
  try {
    const decoded = bech32.decode(sourceAddress);
    return bech32.encode(targetNetwork.addressPrefix, decoded.words);
  } catch (err) {
    console.warn("failed to convert cosmos address", sourceAddress, err);
    return undefined;
  }
};
