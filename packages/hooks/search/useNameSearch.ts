import { useQuery } from "@tanstack/react-query";

import { SearchNamesRequest } from "../../api/marketplace/v1/marketplace";
import { getNetwork } from "../../networks";
import { getMarketplaceClient } from "../../utils/backend";

export const useNameSearch = (req: Partial<SearchNamesRequest>) => {
  const { data: names = [], ...other } = useQuery(
    ["searchNames", req],
    async () => {
      const network = getNetwork(req.networkId);
      if (!network?.backendEndpoint || network?.backendEndpoint === "TODO") {
        return [];
      }
      if (!req.input) {
        return [];
      }
      const client = getMarketplaceClient(req.networkId);
      if (!client) {
        return [];
      }
      const reply = await client.SearchNames(req);
      return reply.names;
    },
    {
      staleTime: Infinity,
      enabled: !!(req.networkId && req.input),
    }
  );
  return { names, ...other };
};
