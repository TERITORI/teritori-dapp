import { useQuery } from "@tanstack/react-query";

import { useMainPremiumChannel } from "./usePremiumChannel";

import { parseUserId } from "@/networks";
import { mustGetCw721MembershipQueryClient } from "@/utils/feed/client";

export const usePremiumSubscription = (
  channelUserId: string | undefined,
  subUserId: string | undefined,
) => {
  const { data: channel } = useMainPremiumChannel(channelUserId);
  return useQuery(
    ["premium-is-subscribed", channelUserId, subUserId],
    async () => {
      const [network] = parseUserId(channelUserId);
      const [, subAddr] = parseUserId(subUserId);

      if (!channel || !network || !subAddr) {
        return null;
      }

      const client = await mustGetCw721MembershipQueryClient(network.id);

      const result = await client.subscription({
        channelId: channel.id,
        subAddr,
      });

      return result;
    },
    { staleTime: Infinity, enabled: !!channel },
  );
};
