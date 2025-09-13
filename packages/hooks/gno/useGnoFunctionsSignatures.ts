import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { getGnoNetwork } from "@/networks";

export const gnoFunctionsSignaturesOpts = (
  networkId: string | undefined,
  pkgPath: string | undefined,
) =>
  queryOptions({
    queryKey: [networkId, pkgPath],
    queryFn: async () => {
      if (!networkId || !pkgPath) {
        return [];
      }
      const network = getGnoNetwork(networkId);
      if (!network) {
        return [];
      }
      const client = new GnoJSONRPCProvider(network.endpoint);
      const sigs = await client.getFunctionSignatures(pkgPath);
      return sigs;
    },
    staleTime: Infinity,
  });

export const useGnoFunctionsSignatures = (
  networkId: string | undefined,
  pkgPath: string | undefined,
) => {
  return useQuery(gnoFunctionsSignaturesOpts(networkId, pkgPath));
};
