import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  ProposalResponse,
  Status,
} from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import {
  extractGnoJSONString,
  extractGnoNumber,
  extractGnoString,
} from "../../utils/gno";

export const daoProposalsQueryKey = (daoId: string | undefined) => [
  "dao-proposals",
  daoId,
];

export type AppProposalResponse = ProposalResponse & {
  proposal: { actions: string[] };
};

type GnoProposalVotes = {
  yes: number;
  no: number;
  abstain: number;
};

type GnoDAOProposal = {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "Open" | "Passed" | "Executed"; // can also be Unknown($value)
  messages: unknown[]; // TODO: type
  // Ballots     *avl.Tree // dev
  votes: GnoProposalVotes;
  // Status ProposalStatus
};

export const useDAOProposals = (daoId: string | undefined) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { daoProposals: cosmWasmDAOProposals, ...cosmWasmOther } =
    useCosmWasmDAOProposals(daoId);
  const { data: gnoDAOProposals, ...gnoOther } = useQuery(
    [daoProposalsQueryKey(daoId), NetworkKind.Gno],
    async () => {
      if (network?.kind !== NetworkKind.Gno) return [];
      const provider = new GnoJSONRPCProvider(network.endpoint);

      const gnoProposals: GnoDAOProposal[] = extractGnoJSONString(
        await provider.evaluateExpression(daoAddress, "GetProposalsJSON(0)")
      );

      const proposals: AppProposalResponse[] = [];

      for (let i = 0; i < gnoProposals.length; i++) {
        const prop = gnoProposals[i];
        const title = prop.title;
        const description = prop.description;
        const status = prop.status.toLowerCase() as Status;
        const proposer = prop.proposer;
        const yesVotes = prop.votes.yes;
        const noVotes = prop.votes.no;
        const abstainVotes = prop.votes.abstain;

        // TODO: threshold should be stored in the proposal for executed proposals (maybe passed too)
        const threshold =
          extractGnoNumber(
            await provider.evaluateExpression(
              daoAddress,
              `uint64(*GetCore().ProposalModules()[0].Threshold().ThresholdQuorum.Threshold.Percent)`
            )
          ) / 10000;
        const quorum =
          extractGnoNumber(
            await provider.evaluateExpression(
              daoAddress,
              `uint64(*GetCore().ProposalModules()[0].Threshold().ThresholdQuorum.Quorum.Percent)`
            )
          ) / 10000;

        const numActions = prop.messages.length;
        const actions: string[] = [];
        for (let m = 0; m < numActions; m++) {
          // TODO: don't do one request per message
          try {
            const action = extractGnoString(
              await provider.evaluateExpression(
                daoAddress,
                `GetCore().ProposalModules()[0].Proposals()[${i}].Messages[${m}].String()`
              )
            );
            actions.push(action);
          } catch (e) {
            console.error("failed to fetch action", e);
            actions.push(`${e}`);
          }
        }
        // TODO: render actions
        proposals.push({
          id: i,
          proposal: {
            title,
            description,
            votes: {
              yes: yesVotes.toString(),
              no: noVotes.toString(),
              abstain: abstainVotes.toString(),
            },
            allow_revoting: false,
            expiration: "TODO" as any,
            msgs: [],
            actions,
            proposer,
            start_height: 42,
            status,
            threshold: {
              threshold_quorum: {
                threshold: { percent: `${threshold}` },
                quorum: { percent: `${quorum}` },
              },
            },
            total_power: "0",
          },
        });
      }
      return proposals;
    },
    { staleTime: Infinity, enabled: !!daoId }
  );
  if (network?.kind === NetworkKind.Gno) {
    return {
      daoProposals: gnoDAOProposals,
      ...gnoOther,
    };
  }
  return {
    daoProposals: cosmWasmDAOProposals,
    ...cosmWasmOther,
  };
};

export const useCosmWasmDAOProposals = (daoId: string | undefined) => {
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;

  const { data, ...other } = useQuery(
    [daoProposalsQueryKey(daoId), NetworkKind.Cosmos],
    async () => {
      if (!networkId || !proposalModuleAddress) return null;

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const daoProposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );

      const allProposals: AppProposalResponse[] = [];

      let startAfter = 0;
      while (true) {
        const listProposals = await daoProposalClient.listProposals({
          limit: 200,
          startAfter,
        });
        if (listProposals.proposals.length === 0) break;
        allProposals.push(
          ...listProposals.proposals.map((p) => ({
            ...p,
            proposal: {
              ...p.proposal,
              actions: [] as string[],
            },
          }))
        );
        startAfter += listProposals.proposals.length;
      }

      return allProposals;
    },
    { staleTime: Infinity, enabled: !!(networkId && proposalModuleAddress) }
  );
  return { daoProposals: data, ...other };
};

export const useInvalidateDAOProposals = (daoId: string | undefined) => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries(daoProposalsQueryKey(daoId)),
    [queryClient, daoId]
  );
};
