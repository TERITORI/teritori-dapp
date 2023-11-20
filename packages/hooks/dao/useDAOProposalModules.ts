import { useQuery } from "@tanstack/react-query";

import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { ArrayOfProposalModule } from "../../contracts-clients/dao-core/DaoCore.types";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

const useDAOProposalModules = (
  daoId: string | undefined,
  enabled?: boolean,
) => {
  const { data, ...other } = useQuery(
    ["daoProposalModules", daoId],
    async () => {
      if (!daoId) {
        return null;
      }
      const [network, daoCoreAddress] = parseUserId(daoId);
      if (!network) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const coreClient = new DaoCoreQueryClient(cosmwasmClient, daoCoreAddress);
      const proposalModules = await coreClient.proposalModules({}); // FIXME: pagination
      return proposalModules;
    },
    { staleTime: Infinity, enabled: (enabled ?? true) && !!daoId },
  );
  return { daoProposalModules: data, ...other };
};

export const useDAOFirstProposalModule = (
  daoId: string | undefined,
  enabled?: boolean,
) => {
  const { daoProposalModules, ...other } = useDAOProposalModules(
    daoId,
    enabled,
  );
  return {
    daoFirstProposalModule: firstProposalModule(daoProposalModules),
    ...other,
  };
};

const firstProposalModule = (
  proposalModules: ArrayOfProposalModule | null | undefined,
) => {
  if (proposalModules === undefined) {
    return undefined;
  }
  if (proposalModules === null || proposalModules.length === 0) {
    return null;
  }
  return proposalModules[0];
};
