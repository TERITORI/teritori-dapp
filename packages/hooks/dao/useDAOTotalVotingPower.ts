import { useQuery } from "@tanstack/react-query";

import { useDAOVotingModule } from "./useDAOVotingModule";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const useDAOTotalVotingPower = (
  daoId: string | undefined,
  height?: number | undefined
) => {
  const { daoVotingModule } = useDAOVotingModule(daoId);
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { data, ...other } = useQuery(
    ["daoTotalVotingPower", networkId, daoVotingModule, height],
    async () => {
      if (!networkId || !daoVotingModule) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const votingClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        daoVotingModule
      );
      return await votingClient.totalPowerAtHeight({ height });
    },
    {
      staleTime: Infinity,
      enabled: !!(networkId && daoVotingModule),
    }
  );
  return { daoTotalVotingPower: data, ...other };
};
