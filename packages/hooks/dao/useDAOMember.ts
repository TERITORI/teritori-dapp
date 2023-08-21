import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useDAOGroup } from "./useDAOGroup";
import { useDAOMembers } from "./useDAOMembers";
import { useDAOType } from "./useDAOType";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { MemberResponse } from "../../contracts-clients/cw4-group/Cw4Group.types";
import {
  NetworkKind,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";
import { DaoType } from "../../screens/Organizations/types";
import { extractGnoNumber } from "../../utils/gno";

export const useDAOMember = (
  daoId: string,
  userId: string | undefined,
  enabled?: boolean
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
    }
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
          `GetCore().VotingModule().VotingPower("${userAddress}")`
        )
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
    }
  );
  return {
    data: network?.kind === NetworkKind.Gno ? gnoData : cosmWasmData,
    ...other,
  };
};

export const useIsDAOMember = (
  daoId: string,
  userId: string | undefined,
  enabled?: boolean
) => {
  const [network, address] = parseUserId(daoId);
  const daoType = useDAOType(network?.id, daoId);
  const { data: member } = useDAOMember(daoId, userId, enabled);
  const dataMembers = useDAOMembers(daoId);
  const members = useMemo(() => dataMembers?.members, [dataMembers]);

  switch (daoType) {
    case DaoType.MEMBER_BASED: {
      return member === undefined ? undefined : (member?.weight ?? 0) > 0;
    }
    case DaoType.NFT_BASED: {
      return !!members?.find((m) => m.addr === address);
    }
    default:
      return null;
  }
};
