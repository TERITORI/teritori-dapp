import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";

import { Cw4GroupQueryClient } from "@/contracts-clients/cw4-group/Cw4Group.client";
import {
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "@/networks";
import { extractGnoJSONString } from "@/utils/gno";

// FIXME: pagination

type GnoDAOMember = {
  address: string;
  power: number;
  roles?: string[];
};

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
            network.id,
          );
          const cw4Client = new Cw4GroupQueryClient(
            cosmwasmClient,
            daoGroupAddress,
          );
          const { members } = await cw4Client.listMembers({ limit: 100 });
          return members.map((member) => ({
            addr: member.addr,
            weight: member.weight,
            roles: [],
          }));
        }
        case NetworkKind.Gno: {
          if (!network.groupsPkgPath) {
            return [];
          }
          const provider = new GnoJSONRPCProvider(network.endpoint);
          const res: GnoDAOMember[] = extractGnoJSONString(
            await provider.evaluateExpression(
              daoAddress,
              `getMembersJSON("", "", 0)`,
            ),
          );
          return res.map((member) => ({
            addr: member.address,
            weight: member.power,
            roles: member.roles || [],
          }));
        }
      }
    },
    { staleTime: Infinity },
  );
  return { members, ...other };
};
