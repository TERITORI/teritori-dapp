import { useQuery } from "@tanstack/react-query";

import { useDAOFirstProposalModule } from "./useDAOProposalModules";
import { DaoProposalSingleQueryClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const useDAOProposalsConfig = (daoId: string | undefined) => {
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const proposalModuleAddress = daoFirstProposalModule?.address;
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { data, ...other } = useQuery(
    ["daoProposalsConfig", networkId, proposalModuleAddress],
    async () => {
      if (!networkId || !proposalModuleAddress) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const proposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );
      return await proposalClient.config();
    },
    {
      staleTime: Infinity,
      enabled: !!(networkId && proposalModuleAddress),
    }
  );
  return { daoProposalsConfig: data, ...other };
};
