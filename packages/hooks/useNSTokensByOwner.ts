import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { parseUserId } from "../networks";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";
import { isNSPath, isNSToken } from "../utils/tns";

const batchSize = 10;

export function useNSTokensByOwner(userId: string | undefined) {
  const { data, isLoading } = useQuery(
    ["nsTokensByOwner", userId],
    async () => {
      const [network, address] = parseUserId(userId);

      if (!network || !address) {
        return [];
      }

      const nsClient = await getCosmosNameServiceQueryClient(network.id);
      if (!nsClient) {
        return [];
      }

      let startAfter: string | undefined;
      const tokens: string[] = [];

      while (true) {
        const reply = await nsClient.tokens({
          owner: address,
          limit: batchSize,
          startAfter,
        });

        if (reply.tokens.length < 1) {
          break;
        }

        tokens.push(...reply.tokens);

        startAfter = reply.tokens[reply.tokens.length - 1];
      }

      return tokens;
    },
  );

  const [tokens, paths] = useMemo(() => {
    return [data?.filter(isNSToken), data?.filter(isNSPath)];
  }, [data]);

  return {
    pathsAndTokens: data || [],
    tokens: tokens || [],
    paths: paths || [],
    loadingTokens: isLoading,
  };
}
