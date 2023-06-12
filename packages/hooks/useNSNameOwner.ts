import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { gnoTest3Network } from "../networks/gno-test3";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";
import { extractGnoString } from "../utils/gno";

export const useNSNameOwner = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
  enabled?: boolean
) => {
  const { data, ...other } = useQuery(
    ["nsNameOwner", networkId, tokenId],
    async () => {
      if (!tokenId) {
        return null;
      }

      if (tokenId.endsWith(".gno")) {
        const client = new GnoJSONRPCProvider(gnoTest3Network.endpoint);
        const addr = extractGnoString(
          await client.evaluateExpression(
            gnoTest3Network.nameServiceContractAddress,
            `string(GetUserByName("${tokenId.substring(
              0,
              tokenId.length - 4
            )}").address)`
          )
        );
        console.log("addr for", tokenId, "is", addr);
        return addr;
      }

      const nsClient = await getCosmosNameServiceQueryClient(networkId);
      if (!nsClient) {
        return null;
      }

      let ownerInfo;

      try {
        ownerInfo = await nsClient.ownerOf({
          tokenId,
        });
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          return null;
        }
        throw err;
      }

      return ownerInfo.owner;
    },
    { staleTime: Infinity, enabled }
  );
  return { nameOwner: data, notFound: data === null, ...other };
};
