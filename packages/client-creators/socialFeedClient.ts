import { Keplr } from "@keplr-wallet/types";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";

import {
  TeritoriSocialFeedClient,
  TeritoriSocialFeedQueryClient,
} from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface SigningSocialFeedClientParams {
  keplr: KeplrWalletConnectV1 | Keplr | undefined;
  networkId: string;
  walletAddress: string;
}

interface NonSigningSocialFeedClientParams {
  networkId: string;
}

const cachedSigningClients: { [key: string]: TeritoriSocialFeedClient } = {};

export const signingSocialFeedClient = async ({
  keplr,
  networkId,
  walletAddress,
}: SigningSocialFeedClientParams) => {
  const network = mustGetCosmosNetwork(networkId);
  const socialFeedContractAddress = network.socialFeedContractAddress || "";

  const cacheKey = `${networkId}-${walletAddress}`;

  if (cachedSigningClients[cacheKey]) {
    return cachedSigningClients[cacheKey];
  } else {
    const signingComswasmClient = await getKeplrSigningCosmWasmClient(
      keplr,
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
  const network = mustGetCosmosNetwork(networkId);
  const socialFeedContractAddress = network.socialFeedContractAddress || "";

  const nonSigningCosmWasmClient = await mustGetNonSigningCosmWasmClient(
    networkId
  );

  return new TeritoriSocialFeedQueryClient(
    nonSigningCosmWasmClient,
    socialFeedContractAddress
  );
};
