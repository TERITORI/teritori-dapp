import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { MemberResponse } from "../../contracts-clients/cw4-group/Cw4Group.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import { extractGnoNumber } from "../../utils/gno";

const useDAOMember = (
  daoId: string | undefined,
  userId: string | undefined,
  enabled?: boolean,
) => {
  const { data: groupAddress } = useDAOGroup(daoId);
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  const { data: cosmWasmData, ...other } = useQuery(
    ["cosmWasmDAOMember", networkId, groupAddress, userId],
    async () => {
      const [, userAddress] = parseUserId(userId);
      if (!networkId || !groupAddress || !userAddress) return null;
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const groupClient = new Cw4GroupQueryClient(cosmwasmClient, groupAddress);
      return await groupClient.member({ addr: userAddress });
    },
    {
      staleTime: Infinity,
      enabled: !!(
        (enabled ?? true) &&
        network?.kind === NetworkKind.Cosmos &&
        networkId &&
        groupAddress &&
        userId
      ),
    },
  );
  const { data: gnoData } = useQuery(
    ["gnoDAOMember", daoId, userId],
    async () => {
      const [network, packagePath] = parseUserId(daoId);
      if (network?.kind !== NetworkKind.Gno) {
        return null;
      }
      const [, userAddress] = parseUserId(userId);
      const provider = new GnoJSONRPCProvider(network.endpoint);
      const power = extractGnoNumber(
        await provider.evaluateExpression(
          packagePath,
          `daoCore.VotingModule().VotingPowerAtHeight("${userAddress}", 0)`,
          0,
        ),
      );
      const res: MemberResponse = {
        weight: power,
      };
      return res;
    },
    {
      staleTime: Infinity,
      enabled: !!(
        (enabled ?? true) &&
        network?.kind === NetworkKind.Gno &&
        daoId &&
        userId
      ),
    },
  );
  return {
    data: network?.kind === NetworkKind.Gno ? gnoData : cosmWasmData,
    ...other,
  };
};

export const useIsDAOMember = (
  daoId: string | undefined,
  userId: string | undefined,
  enabled?: boolean,
) => {
  const { data: member, ...other } = useDAOMember(daoId, userId, enabled);
  return {
    isDAOMember: member === undefined ? undefined : (member?.weight ?? 0) > 0,
    ...other,
  };
};
