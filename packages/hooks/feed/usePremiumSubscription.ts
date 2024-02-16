import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "@/networks";
import { mustGetCw721MembershipQueryClient } from "@/utils/feed/client";

export const usePremiumSubscription = (
  channelUserId: string | undefined,
  subUserId: string | undefined,
) => {
  console.log("use premium sub", channelUserId, subUserId);
  return useQuery(
    ["premium-is-subscribed", channelUserId, subUserId],
    async () => {
      console.log("fetch sub", channelUserId, subUserId);

      const [network, channelAddr] = parseUserId(channelUserId);
      const [, subAddr] = parseUserId(subUserId);

      if (!network || !channelAddr || !subAddr) {
        return null;
      }

      const client = await mustGetCw721MembershipQueryClient(network.id);

      const tokens = await client.tokens({ owner: subAddr });
      console.log("sub tokens", tokens);

      const allTokens = await client.allTokens({});
      console.log("all sub tokens", allTokens);

      const result = await client.subscription({
        channelAddr,
        subAddr,
      });
      console.log("got sub", result);
      return result;
    },
    { staleTime: Infinity },
  );
};
