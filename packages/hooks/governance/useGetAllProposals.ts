import { useQuery } from "@tanstack/react-query";

import { mustGetCosmosNetwork } from "@/networks";
import { Proposal } from "@/utils/types/gov";

export const useGetAllProposals = (networkId: string) => {
  const { data } = useQuery(
    ["proposals", networkId],
    async () => {
      const network = mustGetCosmosNetwork(networkId);
      const res = await fetch(
        `${network.restEndpoint}/cosmos/gov/v1beta1/proposals`,
      );
      const data: { proposals: Proposal[] } = await res.json();

      return data.proposals;
    },
    { staleTime: Infinity },
  );
  return data?.reverse() || [];
};
