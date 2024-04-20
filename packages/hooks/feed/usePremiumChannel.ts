import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "@/networks";
import { mustGetCw721MembershipQueryClient } from "@/utils/feed/client";

const usePremiumChannel = (
  networkId: string | undefined,
  channelId: string | undefined,
  enabled?: boolean,
) => {
  return useQuery(
    ["feed-premium-channel", networkId, channelId],
    async () => {
      if (!networkId || !channelId) {
        return null;
      }

      const client = await mustGetCw721MembershipQueryClient(networkId);

      try {
        const channel = await client.channel({ channelId });
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
      enabled: (enabled ?? true) && !!networkId && !!channelId,
      staleTime: Infinity,
    },
  );
};

const usePremiumChannelsByOwner = (
  userId: string | undefined,
  enabled?: boolean,
) => {
  return useQuery(
    ["feed-premium-channels", userId],
    async () => {
      if (!userId) {
        return [];
      }
      const [, userAddress] = parseUserId(userId);
      if (!userAddress) {
        return [];
      }

      const client = await mustGetCw721MembershipQueryClient(userId);

      const channels = await client.channelsByOwner({
        ownerAddress: userAddress,
      });
      return channels;
    },
    {
      enabled: (enabled ?? true) && !!userId,
      staleTime: Infinity,
    },
  );
};

export const useMainPremiumChannel = (
  userId: string | undefined,
  enabled?: boolean,
) => {
  const [network] = parseUserId(userId);
  const { data: channels } = usePremiumChannelsByOwner(userId, enabled);
  return usePremiumChannel(network?.id, channels?.[0], enabled);
};
