import { useQuery } from "@tanstack/react-query";

import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { DaoCoreQueryClient } from "../../contracts-clients/dao-core/DaoCore.client";
import { DaoVotingCw4QueryClient } from "../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import { parseUserId, mustGetNonSigningCosmWasmClient } from "../../networks";

// FIXME: split

export const useDAOMembers = (daoId: string | undefined) => {
  const { data: members, ...other } = useQuery(
    ["daoMembers", daoId],
    async () => {
      const [network, daoAddr] = parseUserId(daoId);
      if (!network || !daoAddr) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const daoCoreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddr);
      const votingModuleAddress = await daoCoreClient.votingModule();
      const votingModuleClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        votingModuleAddress
      );
      const cw4Address = await votingModuleClient.groupContract();
      const cw4Client = new Cw4GroupQueryClient(cosmwasmClient, cw4Address);
      const { members } = await cw4Client.listMembers({ limit: 100 });
      return members;
    }
  );
  return { members, ...other };
};
