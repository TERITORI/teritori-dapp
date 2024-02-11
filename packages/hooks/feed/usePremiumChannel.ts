import { useQuery } from "@tanstack/react-query";

import { Cw721MembershipQueryClient } from "@/contracts-clients/cw721-membership";
import {
  NetworkFeature,
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
} from "@/networks";

export const usePremiumChannel = (
  networkId: string | undefined,
  channelAddress: string | undefined,
) => {
  return useQuery(
    ["feed-premium-channel", networkId, channelAddress],
    async () => {
      if (!networkId || !channelAddress) {
        return null;
      }

      const premiumFeedFeature = getNetworkFeature(
        networkId,
        NetworkFeature.CosmWasmPremiumFeed,
      );
      if (!premiumFeedFeature) {
        return null;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new Cw721MembershipQueryClient(
        cosmwasmClient,
        premiumFeedFeature.membershipContractAddress,
      );

      try {
        const channel = await client.channel({ channelAddr: channelAddress });
        return channel;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Channel does not exist")
        ) {
          return null;
        }
        throw error;
      }
    },
    {
      enabled: !!networkId && !!channelAddress,
      staleTime: Infinity,
    },
  );
};
