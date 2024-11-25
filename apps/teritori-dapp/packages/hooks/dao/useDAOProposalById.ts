import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import {
  cosmwasmToAppProposal,
  GnoDAOProposal,
  gnoToAppProposal,
} from "./useDAOProposals";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { DaoProposalSingleQueryClient } from "@/contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "@/networks";
import { extractGnoJSONString } from "@/utils/gno";

const daoProposalByIdQueryKey = (
  daoId: string | undefined,
  proposalId: number | undefined,
) => ["dao-proposals", daoId, proposalId];

export const useDAOProposalById = (
  daoId: string | undefined,
  proposalId: number | undefined,
) => {
  const { setToast } = useFeedbacks();
  const [network, daoAddress] = parseUserId(daoId);
  const { daoProposal: cosmWasmDAOProposal, ...cosmWasmOther } =
    useCosmWasmDAOProposalById(daoId, proposalId);

  const { data: gnoDAOProposal, ...gnoOther } = useQuery(
    daoProposalByIdQueryKey(daoId, proposalId),
    async () => {
      try {
        if (network?.kind !== NetworkKind.Gno)
          throw new Error("Not a Gno network");
        if (!proposalId) throw new Error("Missing proposal id");

        const provider = new GnoJSONRPCProvider(network.endpoint);

        const gnoProposal: GnoDAOProposal = extractGnoJSONString(
          await provider.evaluateExpression(
            daoAddress,
            `getProposalJSON(0, ${proposalId})`,
          ),
        );

        return gnoToAppProposal(gnoProposal);
      } catch (err) {
        const title =
          "Failed to fetch the Gno DAO proposal\nThis proposal might not exist in this DAO";
        const message = err instanceof Error ? err.message : `${err}`;
        setToast({
          title,
          message,
          type: "error",
          mode: "normal",
        });
        console.error(title, message);
        return null;
      }
    },
    {
      staleTime: Infinity,
      enabled: !!(daoId && network?.kind === NetworkKind.Gno && proposalId),
    },
  );

  if (network?.kind === NetworkKind.Gno) {
    return {
      daoProposal: gnoDAOProposal,
      ...gnoOther,
    };
  }

  return {
    daoProposal: cosmWasmDAOProposal,
    ...cosmWasmOther,
  };
};

const useCosmWasmDAOProposalById = (
  daoId: string | undefined,
  proposalId: number | undefined,
) => {
  const { setToast } = useFeedbacks();
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;

  const { data, ...other } = useQuery(
    daoProposalByIdQueryKey(daoId, proposalId),
    async () => {
      try {
        if (!networkId) throw new Error("Missing network id");
        if (!proposalModuleAddress)
          throw new Error("No proposal module address");
        if (!proposalId) throw new Error("Missing proposal id");

        const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
        const daoProposalClient = new DaoProposalSingleQueryClient(
          cosmwasmClient,
          proposalModuleAddress,
        );

        const daoProposal = await daoProposalClient.proposal({
          proposalId,
        });

        return cosmwasmToAppProposal(daoProposal);
      } catch (err) {
        const title =
          "Failed to fetch the Cosmos DAO proposal\nThis proposal might not exist in this DAO";
        const message = err instanceof Error ? err.message : `${err}`;
        setToast({
          title,
          message,
          type: "error",
          mode: "normal",
        });
        console.error(title, message);
        return null;
      }
    },
    {
      staleTime: Infinity,
      enabled: !!(networkId && proposalModuleAddress && proposalId),
    },
  );
  return { daoProposal: data, ...other };
};

export const useInvalidateDAOProposalById = (
  daoId: string | undefined,
  proposalId: number | undefined,
) => {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      queryClient.invalidateQueries(daoProposalByIdQueryKey(daoId, proposalId)),
    [queryClient, daoId, proposalId],
  );
};
