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
import { extractGnoJSONString } from "../../utils/gno";

const daoProposalsQueryKey = (daoId: string | undefined) => [
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
  threshold: any; // TODO: type
  totalPower: number;
  startHeight: number;
  messages: { type: string; payload: unknown }[]; // TODO: type
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
        await provider.evaluateExpression(
          daoAddress,
          `getProposalsJSON(0, 0, "", false)`,
        ),
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
        const threshold =
          prop.threshold.thresholdQuorum.threshold.percent / 10000;
        const quorum = prop.threshold.thresholdQuorum.quorum.percent / 10000;
        const actions = prop.messages.map((m) => JSON.stringify(m));
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
            msgs: prop.messages.map((m) => ({
              ...m,
              gno: true,
            })),
            actions,
            proposer,
            start_height: prop.startHeight,
            status,
            threshold: {
              threshold_quorum: {
                threshold: { percent: `${threshold}` },
                quorum: { percent: `${quorum}` },
              },
            },
            total_power: prop.totalPower.toString(),
          },
        });
      }
      return proposals;
    },
    { staleTime: Infinity, enabled: !!daoId },
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

const useCosmWasmDAOProposals = (daoId: string | undefined) => {
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
        proposalModuleAddress,
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
          })),
        );
        startAfter += listProposals.proposals.length;
      }

      return allProposals;
    },
    { staleTime: Infinity, enabled: !!(networkId && proposalModuleAddress) },
  );
  return { daoProposals: data, ...other };
};

export const useInvalidateDAOProposals = (daoId: string | undefined) => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries(daoProposalsQueryKey(daoId)),
    [queryClient, daoId],
  );
};
