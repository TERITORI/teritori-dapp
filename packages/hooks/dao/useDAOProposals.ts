import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";

import { DaoProposalSingleQueryClient } from "@/contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  ProposalResponse,
  Status,
} from "@/contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "@/networks";
import { extractGnoJSONString } from "@/utils/gno";

const daoProposalsQueryKey = (daoId: string | undefined) => [
  "dao-proposals",
  daoId,
];

export type AppProposalResponse = ProposalResponse & {
  proposal: { actions: string[] };
};

export type GnoDAOProposal = {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "Open" | "Passed" | "Executed"; // can also be Unknown
  startHeight: number;
  signal: number;
};

export const useDAOProposals = (daoId: string | undefined) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { daoProposals: cosmWasmDAOProposals, ...cosmWasmOther } =
    useCosmWasmDAOProposals(daoId);

  const { data: gnoDAOProposals, ...gnoOther } = useQuery(
    [...daoProposalsQueryKey(daoId), "gno"],
    async () => {
      if (network?.kind !== NetworkKind.Gno) return [];
      const provider = new GnoJSONRPCProvider(network.endpoint);

      const gnoProposals: GnoDAOProposal[] = extractGnoJSONString(
        await provider.evaluateExpression(
          daoAddress,
          `dao.Core.ProposalModule.GetProposalsJSON()`,
        ),
      );

      const proposals: AppProposalResponse[] = [];

      for (let i = 0; i < gnoProposals.length; i++) {
        const prop = gnoProposals[i];
        proposals.push(gnoToAppProposal(prop));
      }
      return proposals;
    },
    {
      staleTime: Infinity,
      enabled: !!daoId && network?.kind === NetworkKind.Gno,
    },
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
    [...daoProposalsQueryKey(daoId), "cosmwasm"],
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
          ...listProposals.proposals.map((p) => cosmwasmToAppProposal(p)),
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

export const gnoToAppProposal = (proposal: GnoDAOProposal) => {
  // TODO: render actions
  const title = proposal.title;
  const description = proposal.description;
  const status = proposal.status.toLowerCase() as Status;
  const proposer = proposal.proposer;

  const appProposal: AppProposalResponse = {
    id: proposal.id,
    proposal: {
      title,
      description,
      votes: {
        yes: `${Math.ceil(proposal.signal * 10000)}`,
        no: "0",
        abstain: "0",
      },
      allow_revoting: true,
      expiration: "TODO" as any,
      msgs: [],
      actions: [],
      proposer,
      start_height: proposal.startHeight,
      status,
      threshold: {
        threshold_quorum: {
          threshold: { percent: "1" },
          quorum: { percent: "0" },
        },
      },
      total_power: "10000",
    },
  };

  return appProposal;
};

export const cosmwasmToAppProposal = (proposal: ProposalResponse) => {
  const appPrpoposal: AppProposalResponse = {
    ...proposal,
    proposal: {
      ...proposal.proposal,
      actions: [] as string[],
    },
  };
  return appPrpoposal;
};
