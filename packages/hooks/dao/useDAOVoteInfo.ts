import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const daoVoteInfoQueryKey = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined
) => ["daoVoteInfo", daoId, userId, proposalId];

export const useDAOVoteInfo = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined,
  enabled?: boolean
) => {
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;

  const { data, ...other } = useQuery(
    daoVoteInfoQueryKey(daoId, userId, proposalId),
    async () => {
      const [network] = parseUserId(daoId);
      const networkId = network?.id;

      const [userNetwork, userAddress] = parseUserId(userId);

      if (
        !networkId ||
        !userAddress ||
        !proposalId ||
        !proposalModuleAddress ||
        userNetwork?.id !== networkId
      ) {
        return null;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const daoClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );
      return await daoClient.getVote({
        proposalId,
        voter: userAddress,
      });
    },
    {
      staleTime: Infinity,
      enabled:
        (enabled ?? true) &&
        !!(daoId && userId && proposalId && proposalModuleAddress),
    }
  );
  return { daoVoteInfo: data, ...other };
};

export const useInvalidateDAOVoteInfo = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined
) => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    return queryClient.invalidateQueries(
      daoVoteInfoQueryKey(daoId, userId, proposalId)
    );
  }, [daoId, proposalId, queryClient, userId]);
};
