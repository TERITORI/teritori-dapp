import { useQuery } from "@tanstack/react-query";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { VoteInfo } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

const batchSize = 200;

export const useDAOProposalVotes = (
  daoId: string | undefined,
  proposalId: number | undefined
) => {
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { data, ...other } = useQuery(
    ["daoProposalVotes", networkId, proposalModuleAddress, proposalId],
    async () => {
      if (!networkId || !proposalModuleAddress || !proposalId) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const proposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );

      const allVotes: VoteInfo[] = [];

      let startAfter: string | undefined = undefined;
      while (true) {
        // @ts-expect-error
        const { votes } = await proposalClient.listVotes({
          proposalId,
          limit: batchSize,
          startAfter,
        });
        if (votes.length === 0) {
          break;
        }
        allVotes.push(...votes);
        startAfter = votes[votes.length - 1].voter;
      }

      return allVotes;
    },
    {
      staleTime: Infinity,
      enabled: !!(networkId && proposalModuleAddress && proposalId),
    }
  );
  return { daoProposalVotes: data, ...other };
};
