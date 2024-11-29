import { useQuery } from "@tanstack/react-query";

import { mustGetCw721MembershipQueryClient } from "@/utils/feed/client";

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

      const client = await mustGetCw721MembershipQueryClient(networkId);

      try {
        const channel = await client.channel({ channelAddr: channelAddress });
        return channel;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("This address does not own a channel.")
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
