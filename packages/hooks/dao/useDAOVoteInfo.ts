import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { VoteResponse } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import { extractGnoNumber } from "../../utils/gno";

const daoVoteInfoQueryKey = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined,
) => ["daoVoteInfo", daoId, userId, proposalId];

export const useDAOVoteInfo = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined,
  enabled?: boolean,
) => {
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;

  const { data, ...other } = useQuery(
    daoVoteInfoQueryKey(daoId, userId, proposalId),
    async () => {
      const [network] = parseUserId(daoId);
      const networkId = network?.id;

      const [userNetwork, userAddress] = parseUserId(userId);

      switch (network?.kind) {
        case NetworkKind.Cosmos: {
          if (
            !networkId ||
            !userAddress ||
            !proposalId ||
            !proposalModuleAddress ||
            userNetwork?.id !== networkId
          ) {
            return null;
          }

          const cosmwasmClient =
            await mustGetNonSigningCosmWasmClient(networkId);
          const daoClient = new DaoProposalSingleQueryClient(
            cosmwasmClient,
            proposalModuleAddress,
          );
          const res = await daoClient.getVote({
            proposalId,
            voter: userAddress,
          });
          return res;
        }
        case NetworkKind.Gno: {
          const [, daoAddress] = parseUserId(daoId);
          const client = new GnoJSONRPCProvider(network?.endpoint);
          const power = extractGnoNumber(
            await client.evaluateExpression(
              daoAddress,
              `GetCore().ProposalModules()[0].GetBallot(${proposalId}, "${userAddress}").Power`,
            ),
          );
          const v: { vote: Exclude<VoteResponse["vote"], null | undefined> } = {
            vote: { vote: "yes", power: `${power}`, voter: userAddress },
          };
          console.log("getting vote");
          const vote = extractGnoNumber(
            await client.evaluateExpression(
              daoAddress,
              `GetCore().ProposalModules()[0].GetBallot(${proposalId}, "${userAddress}").Vote`,
            ),
          );
          console.log("got vote", vote);
          switch (vote) {
            case 0: {
              break;
            }
            case 1: {
              v.vote.vote = "no";
              break;
            }
            case 2: {
              v.vote.vote = "abstain";
              break;
            }
            default: {
              throw new Error("Unknown vote");
            }
          }
          const vv: VoteResponse = v;
          return vv;
        }
        default: {
          return null;
        }
      }
    },
    {
      staleTime: Infinity,
      enabled:
        (enabled ?? true) && !!(daoId && userId && proposalId !== undefined),
    },
  );
  return { daoVoteInfo: data, ...other };
};

export const useInvalidateDAOVoteInfo = (
  daoId: string | undefined,
  userId: string | undefined,
  proposalId: number | undefined,
) => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    return queryClient.invalidateQueries(
      daoVoteInfoQueryKey(daoId, userId, proposalId),
    );
  }, [daoId, proposalId, queryClient, userId]);
};
