import { TeritoriSocialFeedQueryClient } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../networks";

interface NonSigningSocialFeedClientParams {
  networkId: string;
}

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
