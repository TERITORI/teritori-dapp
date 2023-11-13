import { useQuery } from "@tanstack/react-query";

import { ipfsURLToHTTPURL } from "../utils/ipfs";

export const useRemoteJSON = (uri: string | undefined) => {
  return useQuery(
    ["remoteJSON", uri],
    async () => {
      if (!uri) {
        return undefined;
      }
      const reply = await fetch(ipfsURLToHTTPURL(uri));
      return (await reply.json()) as unknown;
    },
    { staleTime: Infinity, enabled: !!uri },
  );
};
