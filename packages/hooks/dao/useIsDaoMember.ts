import { useQuery } from "@tanstack/react-query";

import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

// FIXME: split

export const useIsDAOMember = (
  daoId: string | undefined,
  userId: string | undefined
) => {
  return useQuery(
    ["isDAOMember", daoId, userId],
    async () => {
      if (!daoId || !userId) return null;
      const [network, daoAddress] = parseUserId(daoId);
      if (!network) return null;
      const [, userAddress] = parseUserId(userId);
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const daoClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);
      const votingModuleAddress = await daoClient.votingModule();
      const votingClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        votingModuleAddress
      );
      const groupAddress = await votingClient.groupContract();
      const groupClient = new Cw4GroupQueryClient(cosmwasmClient, groupAddress);
      try {
        const member = await groupClient.member({ addr: userAddress });
        return !!member.weight;
      } catch {
        return false;
      }
    },
    { staleTime: Infinity, enabled: !!(daoId && userId) }
  );
};
