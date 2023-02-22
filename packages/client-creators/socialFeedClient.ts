import { TeritoriSocialFeedClient } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

interface SocialFeedClientParams {
  networkId: string;
  walletAddress: string;
  contractAddress?: string;
}

const cachedClients: { [key: string]: TeritoriSocialFeedClient } = {};

export const socialFeedClient = async ({
  networkId,
  walletAddress,
  contractAddress = process.env.TERITORI_SOCIAL_FEED_CONTRACT_ADDRESS || "",
}: SocialFeedClientParams) => {
  const socialFeedContractAddress = contractAddress.startsWith("tori-")
    ? contractAddress.substring(5)
    : contractAddress;

  const cacheKey = `${walletAddress}${contractAddress}`;

  if (cachedClients[cacheKey]) {
    return cachedClients[cacheKey];
  } else {
    const signingComswasmClient = walletAddress
      ? await getKeplrSigningCosmWasmClient(networkId)
      : await mustGetNonSigningCosmWasmClient(networkId);
    const client = new TeritoriSocialFeedClient(
      signingComswasmClient,
      walletAddress,
      socialFeedContractAddress
    );

    cachedClients[cacheKey] = client;
    return client;
  }
};
