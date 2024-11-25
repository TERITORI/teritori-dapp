import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "@/networks";
import { mustGetCw721MembershipQueryClient } from "@/utils/feed/client";

export const usePremiumSubscription = (
  channelUserId: string | undefined,
  subUserId: string | undefined,
) => {
  return useQuery(
    ["premium-is-subscribed", channelUserId, subUserId],
    async () => {
      const [network, channelAddr] = parseUserId(channelUserId);
      const [, subAddr] = parseUserId(subUserId);

      if (!network || !channelAddr || !subAddr) {
        return null;
      }

      const client = await mustGetCw721MembershipQueryClient(network.id);

      const result = await client.subscription({
        channelAddr,
        subAddr,
      });

      return result;
    },
    { staleTime: Infinity },
  );
};
