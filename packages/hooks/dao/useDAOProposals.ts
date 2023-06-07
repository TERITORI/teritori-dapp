import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { ProposalResponse } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const daoProposalsQueryKey = (
  networkId: string | undefined,
  proposalModuleAddres: string | undefined
) => ["daoProposals", networkId, proposalModuleAddres];

export const useDAOProposals = (daoId: string | undefined) => {
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;

  const { data, ...other } = useQuery(
    daoProposalsQueryKey(networkId, proposalModuleAddress),
    async () => {
      if (!networkId || !proposalModuleAddress) return null;

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const daoProposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );

      const allProposals: ProposalResponse[] = [];

      let startAfter = 0;
      while (true) {
        const listProposals = await daoProposalClient.listProposals({
          limit: 200,
          startAfter,
        });
        if (listProposals.proposals.length === 0) break;
        allProposals.push(...listProposals.proposals);
        startAfter += listProposals.proposals.length;
      }

      return allProposals;
    },
    { staleTime: Infinity, enabled: !!(networkId || proposalModuleAddress) }
  );
  return { daoProposals: data, ...other };
};

export const useInvalidateDAOProposals = (daoId: string | undefined) => {
  const queryClient = useQueryClient();
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  return useCallback(() => {
    const [network] = parseUserId(daoId);
    return queryClient.invalidateQueries(
      daoProposalsQueryKey(network?.id, daoFirstProposalModule?.address)
    );
  }, [daoFirstProposalModule?.address, daoId, queryClient]);
};
