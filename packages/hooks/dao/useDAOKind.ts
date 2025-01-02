import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { NetworkKind, parseUserId } from "@/networks";
import { extractGnoString } from "@/utils/gno";
import { extractDaoKind } from "@/utils/gnodao/helpers";

export const useDAOKind = (daoId: string | undefined) => {
  const { data, ...other } = useQuery(
    ["daoKind", daoId],
    async () => {
      if (!daoId) {
        return null;
      }
      const [network, packagePath] = parseUserId(daoId);
      if (network?.kind !== NetworkKind.Gno) {
        return null;
      }
      // Ensure is a DAO by checking the addr is a realm addr and not an EOA
      if (!packagePath?.startsWith("gno.land/")) {
        return null;
      }

      const provider = new GnoJSONRPCProvider(network.endpoint);
      const info = extractGnoString(
        await provider.evaluateExpression(
          packagePath,
          `daoCore.VotingModule().Info().String()`,
          0,
        ),
      );

      return extractDaoKind(info);
    },
    { staleTime: Infinity, enabled: !!daoId },
  );
  return { daoKind: data, ...other };
};
