import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getGnoNetwork } from "../../networks";
import { extractGnoJSONString } from "../../utils/gno";

export const useGetBanPostProposals = (networkId: string | undefined) => {
  const { data: banPostProposals, ...other } = useQuery(
    ["banPostProposals", networkId],
    async () => {
      if (!networkId) return [];

      const network = getGnoNetwork(networkId);
      if (!network?.socialFeedsDAOPkgPath) {
        return [];
      }

      const provider = new GnoJSONRPCProvider(network.endpoint);
      const proposals = extractGnoJSONString(
        await provider.evaluateExpression(
          network?.socialFeedsDAOPkgPath,
          `getProposalsJSON(0, 42, "", false)`,
        ),
      );

      return proposals;
    },
    { initialData: [] },
  );
  return { banPostProposals, ...other };
};

export const useGetBanPostProposalById = (
  networkId: string | undefined,
  proposalId: string,
) => {
  const { banPostProposals } = useGetBanPostProposals(networkId);

  return useMemo(() => {
    return banPostProposals.find((p: any) => +p.id === +proposalId);
  }, [banPostProposals, proposalId]);
};
