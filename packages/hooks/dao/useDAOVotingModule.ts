import { useQuery } from "@tanstack/react-query";

import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const useDAOVotingModule = (daoId: string | undefined) => {
  const { data, ...other } = useQuery(
    ["daoVotingModule", daoId],
    async () => {
      if (!daoId) {
        return null;
      }
      const [network, daoCoreAddress] = parseUserId(daoId);
      if (!network) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const coreClient = new DaoCoreQueryClient(cosmwasmClient, daoCoreAddress);
      return await coreClient.votingModule();
    },
    { staleTime: Infinity, enabled: !!daoId },
  );
  return { daoVotingModule: data, ...other };
};
