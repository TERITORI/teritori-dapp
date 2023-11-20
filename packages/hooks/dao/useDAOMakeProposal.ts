import { useCallback } from "react";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { useInvalidateDAOProposals } from "./useDAOProposals";
import { DaoPreProposeSingleClient } from "../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.client";
import { CosmosMsgForEmpty } from "../../contracts-clients/dao-pre-propose-single/DaoPreProposeSingle.types";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  mustGetNonSigningCosmWasmClient,
  getKeplrSigningCosmWasmClient,
  parseUserId,
} from "../../networks";

export const useDAOMakeProposal = (
  daoId: string | undefined,
  enabled?: boolean,
) => {
  const [network] = parseUserId(daoId);
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId, enabled);
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);

  return useCallback(
    async (
      senderAddress: string,
      proposal: {
        description: string;
        msgs: CosmosMsgForEmpty[];
        title: string;
      },
    ) => {
      if (!enabled) {
        throw new Error("Hook is not enabled");
      }

      if (!network?.id) {
        throw new Error("Invalid DAO id");
      }

      if (!daoFirstProposalModule?.address) {
        throw new Error("DAO proposal module address not found");
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const proposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        daoFirstProposalModule?.address,
      );

      const proposalCreationPolicy =
        await proposalClient.proposalCreationPolicy();
      if (!("module" in proposalCreationPolicy)) {
        throw new Error("proposal creation policy is not module");
      }

      const signingClient = await getKeplrSigningCosmWasmClient(network.id);

      const preProposeClient = new DaoPreProposeSingleClient(
        signingClient,
        senderAddress,
        proposalCreationPolicy.module.addr,
      );

      const res = await preProposeClient.propose({
        msg: {
          propose: proposal,
        },
      });

      try {
        await invalidateDAOProposals();
      } catch (err) {
        console.error("failed to invalidate dao proposals", err);
      }

      return res;
    },
    [
      daoFirstProposalModule?.address,
      invalidateDAOProposals,
      network?.id,
      enabled,
    ],
  );
};
