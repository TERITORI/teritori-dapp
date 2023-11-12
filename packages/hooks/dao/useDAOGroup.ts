import { useQuery } from "@tanstack/react-query";

import { useDAOVotingModule } from "./useDAOVotingModule";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import {
  parseUserId,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  getNetwork,
} from "../../networks";

export const useDAOGroup = (daoId: string | undefined, enabled?: boolean) => {
  const { daoVotingModule } = useDAOVotingModule(daoId);
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  return useQuery(
    ["daoGroup", networkId, daoVotingModule],
    async () => {
      if (!networkId || !daoVotingModule) return null;
      if (getNetwork(networkId)?.kind !== NetworkKind.Cosmos) return null;
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const votingClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        daoVotingModule,
      );
      return await votingClient.groupContract();
    },
    {
      staleTime: Infinity,
      enabled: (enabled ?? true) && !!(networkId && daoVotingModule),
    },
  );
};
