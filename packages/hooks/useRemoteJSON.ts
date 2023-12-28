import { useQuery } from "@tanstack/react-query";

import { web3ToWeb2URI } from "../utils/ipfs";

export const useRemoteJSON = (uri: string | undefined) => {
  return useQuery(
    ["remoteJSON", uri],
    async () => {
      if (!uri) {
        return undefined;
      }
      const reply = await fetch(web3ToWeb2URI(uri));
      return (await reply.json()) as unknown;
    },
    { staleTime: Infinity, enabled: !!uri },
  );
};
