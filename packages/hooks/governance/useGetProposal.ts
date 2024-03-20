import { useQuery } from "@tanstack/react-query";

import { mustGetCosmosNetwork } from "@/networks";
import { Proposal } from "@/utils/types/gov";

export const useGetProposal = (networkId: string, id: string) => {
  const { data } = useQuery(
    ["proposal", networkId, id],
    async () => {
      const network = mustGetCosmosNetwork(networkId);
      const res = await fetch(
        `${network.restEndpoint}/cosmos/gov/v1beta1/proposals/${id}`,
      );
      const data: { proposal: Proposal } = await res.json();

      return data.proposal;
    },
    { staleTime: Infinity },
  );
  return data;
};
