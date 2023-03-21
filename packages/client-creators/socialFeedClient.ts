import {
  TeritoriSocialFeedClient,
  TeritoriSocialFeedQueryClient,
} from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

interface SigningSocialFeedClientParams {
  networkId: string;
  walletAddress: string;
}

interface NonSigningSocialFeedClientParams {
  networkId: string;
}

export const signingSocialFeedClient = async ({
  networkId,
  walletAddress,
}: SigningSocialFeedClientParams) => {
  const socialFeedContractAddress =
    process.env.TERITORI_SOCIAL_FEED_CONTRACT_ADDRESS || "";
  const cachedSigningClients: { [key: string]: TeritoriSocialFeedClient } = {};
  const cacheKey = `${walletAddress}${socialFeedContractAddress}`;

  if (cachedSigningClients[cacheKey]) {
    return cachedSigningClients[cacheKey];
  } else {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      networkId
    );
    const client = new TeritoriSocialFeedClient(
      signingComswasmClient,
      walletAddress,
      socialFeedContractAddress
    );

    cachedSigningClients[cacheKey] = client;
    return client;
  }
};

export const nonSigningSocialFeedClient = async ({
  networkId,
}: NonSigningSocialFeedClientParams) => {
  const socialFeedContractAddress =
    process.env.TERITORI_SOCIAL_FEED_CONTRACT_ADDRESS || "";

  const nonSigningCosmWasmClient = await mustGetNonSigningCosmWasmClient(
    networkId
  );

  return new TeritoriSocialFeedQueryClient(
    nonSigningCosmWasmClient,
    socialFeedContractAddress
  );
};
