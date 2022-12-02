import { getSigningCosmWasmClient } from "../utils/keplr";
import { TeritoriSocialFeedClient } from "./../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";

interface SocialFeedClientParams {
  walletAddress: string;
  contractAddress?: string;
}

const cachedClients: { [key: string]: TeritoriSocialFeedClient } = {};

export const socialFeedClient = async ({
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
    const signingComswasmClient = await getSigningCosmWasmClient();
    const client = new TeritoriSocialFeedClient(
      signingComswasmClient,
      walletAddress,
      socialFeedContractAddress
    );

    cachedClients[cacheKey] = client;
    return client;
  }
};
