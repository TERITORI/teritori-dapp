import {
  TeritoriSocialFeedClient,
  TeritoriSocialFeedQueryClient,
} from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

interface SocialFeedClientParams {
  networkId: string;
  walletAddress: string;
}

const cachedSigningClients: { [key: string]: TeritoriSocialFeedClient } = {};
const cachedNonSigningClients: {
  [key: string]: TeritoriSocialFeedQueryClient;
} = {};

export const socialFeedClient = async ({
  networkId,
  walletAddress,
}: SocialFeedClientParams) => {
  const socialFeedContractAddress =
    process.env.TERITORI_SOCIAL_FEED_CONTRACT_ADDRESS || "";
  const cacheKey = `${walletAddress}${socialFeedContractAddress}`;

  if (cachedNonSigningClients[cacheKey]) {
    return cachedNonSigningClients[cacheKey];
  } else if (cachedSigningClients[cacheKey]) {
    return cachedSigningClients[cacheKey];
  } else {
    const nonSigningCosmWasmClient = await mustGetNonSigningCosmWasmClient(
      networkId
    );
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      networkId
    );

    let client;
    if (walletAddress) {
      client = new TeritoriSocialFeedClient(
        signingComswasmClient,
        walletAddress,
        socialFeedContractAddress
      );
      cachedSigningClients[cacheKey] = client;
    } else {
      client = new TeritoriSocialFeedQueryClient(
        nonSigningCosmWasmClient,
        socialFeedContractAddress
      );
      cachedNonSigningClients[cacheKey] = client;
    }

    return client;
  }
};
