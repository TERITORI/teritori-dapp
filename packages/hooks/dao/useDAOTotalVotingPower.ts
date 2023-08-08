import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOVotingModule } from "./useDAOVotingModule";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import { extractGnoNumber } from "../../utils/gno";

export const useDAOTotalVotingPower = (
  daoId: string | undefined,
  height?: number | undefined
) => {
  const { daoVotingModule } = useDAOVotingModule(daoId);
  const [network] = parseUserId(daoId);
  const networkId = network?.id;

  const { data: cosmWasmData, ...other } = useQuery(
    ["cosmWasmDAOTotalVotingPower", networkId, daoVotingModule, height],
    async () => {
      if (!networkId || !daoVotingModule) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const votingClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        daoVotingModule
      );
      return await votingClient.totalPowerAtHeight({ height });
    },
    {
      staleTime: Infinity,
      enabled: !!(networkId && daoVotingModule),
    }
  );

  const { data: gnoData } = useQuery(
    ["gnoDAOTotalVotingPower", daoId],
    async () => {
      const [network, packagePath] = parseUserId(daoId);
      if (network?.kind !== NetworkKind.Gno) {
        return { power: "0" };
      }
      const provider = new GnoJSONRPCProvider(network.endpoint);
      const power = extractGnoNumber(
        await provider.evaluateExpression(
          packagePath,
          `GetCore().VotingModule().TotalPower()`
        )
      );
      return { power: `${power}` };
    },
    {
      staleTime: Infinity,
      enabled: !!daoId,
    }
  );

  return {
    daoTotalVotingPower:
      network?.kind === NetworkKind.Gno ? gnoData : cosmWasmData,
    ...other,
  };
};
