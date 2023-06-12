import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import {
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";

// FIXME: pagination

export const useDAOMembers = (daoId: string | undefined) => {
  const { data: daoGroupAddress } = useDAOGroup(daoId);
  const { data: members, ...other } = useQuery(
    ["daoMembers", daoId, daoGroupAddress],
    async () => {
      const [network, daoAddress] = parseUserId(daoId);
      if (!network?.id) {
        return null;
      }
      switch (network.kind) {
        case NetworkKind.Cosmos: {
          if (!daoGroupAddress) {
            return null;
          }
          const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
            network.id
          );
          const cw4Client = new Cw4GroupQueryClient(
            cosmwasmClient,
            daoGroupAddress
          );
          const { members } = await cw4Client.listMembers({ limit: 100 });
          return members;
        }
        case NetworkKind.Gno: {
          const provider = new GnoJSONRPCProvider(network.endpoint);
          const coreRender = await provider.getRenderOutput(daoAddress, "");
          const lines = coreRender.split("\n");
          const members: { addr: string; weight: number }[] = [];
          for (const line of lines) {
            if (line.startsWith("## Single choice proposals module")) {
              break;
            }
            if (!line.startsWith("- ")) {
              continue;
            }
            members.push({ addr: line.split(" ")[1], weight: 1 });
          }
          return members;
        }
      }
    },
    { staleTime: Infinity }
  );
  return { members, ...other };
};
