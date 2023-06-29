import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { ProposalResponse } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import {
  extractGnoNumber,
  extractGnoString,
  proposalStatusFromNumber,
} from "../../utils/gno";

export const daoProposalsQueryKey = (
  networkId: string | undefined,
  proposalModuleAddres: string | undefined
) => ["daoProposals", networkId, proposalModuleAddres];

export type AppProposalResponse = ProposalResponse & {
  proposal: { actions: string[] };
};

export const useDAOProposals = (daoId: string | undefined) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { daoProposals: cosmWasmDAOProposals, ...other } =
    useCosmWasmDAOProposals(daoId);
  const { data: gnoDAOProposals } = useQuery(
    daoProposalsQueryKey(network?.id, daoAddress),
    async () => {
      if (network?.kind !== NetworkKind.Gno) return [];
      const provider = new GnoJSONRPCProvider(network.endpoint);

      const proposalsCount = extractGnoNumber(
        await provider.evaluateExpression(
          daoAddress,
          "len(GetCore().ProposalModules()[0].Proposals())"
        )
      );

      const proposals: AppProposalResponse[] = [];

      for (let i = 0; i < proposalsCount; i++) {
        const title = extractGnoString(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Title`
          )
        );
        const description = extractGnoString(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Description`
          )
        );
        const status = proposalStatusFromNumber(
          extractGnoNumber(
            await provider.evaluateExpression(
              daoAddress,
              `GetCore().ProposalModules()[0].Proposals()[${i}].Status`
            )
          )
        );
        const proposer = extractGnoString(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Proposer.String()`
          )
        );
        const yesVotes = extractGnoNumber(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Votes.Yes`
          )
        );
        const noVotes = extractGnoNumber(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Votes.No`
          )
        );
        const abstainVotes = extractGnoNumber(
          await provider.evaluateExpression(
            daoAddress,
            `GetCore().ProposalModules()[0].Proposals()[${i}].Votes.Abstain`
          )
        );
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
        const numActions = extractGnoNumber(
          await provider.evaluateExpression(
            daoAddress,
            `len(GetCore().ProposalModules()[0].Proposals()[${i}].Messages)`
          )
        );
        const actions: string[] = [];
        for (let m = 0; m < numActions; m++) {
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
  return {
    daoProposals:
      network?.kind === NetworkKind.Gno
        ? gnoDAOProposals
        : cosmWasmDAOProposals,
    ...other,
  };
};

export const useCosmWasmDAOProposals = (daoId: string | undefined) => {
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
    { staleTime: Infinity, enabled: !!(networkId || proposalModuleAddress) }
  );
  return { daoProposals: data, ...other };
};

export const useInvalidateDAOProposals = (daoId: string | undefined) => {
  const queryClient = useQueryClient();
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  return useCallback(() => {
    const [network, daoAddress] = parseUserId(daoId);
    switch (network?.kind) {
      case NetworkKind.Cosmos:
        return queryClient.invalidateQueries(
          daoProposalsQueryKey(network?.id, daoFirstProposalModule?.address)
        );
      case NetworkKind.Gno:
        return queryClient.invalidateQueries(
          daoProposalsQueryKey(network?.id, daoAddress)
        );
      default:
        return () => {};
    }
  }, [daoFirstProposalModule?.address, daoId, queryClient]);
};
