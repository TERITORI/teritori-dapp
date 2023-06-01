import { useQuery } from "@tanstack/react-query";

import { TeritoriSocialFeedQueryClient } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";

export const useFeedConfig = (networkId: string) => {
  const network = getCosmosNetwork(networkId);
  const { data: feedConfig, ...other } = useQuery(
    ["feedConfig", networkId, network?.socialFeedContractAddress],
    async () => {
      if (!network?.socialFeedContractAddress) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new TeritoriSocialFeedQueryClient(
        cosmwasmClient,
        network.socialFeedContractAddress
      );
      const conf = await client.config();
      return conf;
    }
  );
  return { feedConfig, ...other };
};
