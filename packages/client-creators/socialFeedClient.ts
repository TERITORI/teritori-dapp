import { TeritoriSocialFeedClient } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

interface SocialFeedClientParams {
  networkId: string;
  walletAddress: string;
}

const cachedClients: { [key: string]: TeritoriSocialFeedClient } = {};

export const socialFeedClient = async ({
  networkId,
  walletAddress,
}: SocialFeedClientParams) => {
  const socialFeedContractAddress =
    process.env.TERITORI_SOCIAL_FEED_CONTRACT_ADDRESS || "";
  const cacheKey = `${walletAddress}${socialFeedContractAddress}`;

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
