import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import {
  CosmosNetworkInfo,
  GnoNetworkInfo,
  NetworkKind,
  parseUserId,
} from "../networks";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";
import { extractGnoString } from "../utils/gno";

export interface AliasUserId {
  alias: string | null;
  userId: string;
}

export const nsPrimaryAliasQueryKey = (userId: string | undefined) => [
  "nsPrimaryAlias",
  userId,
];

const cosmosGetUsernameByAddress = async (
  network: CosmosNetworkInfo,
  userAddress: string
) => {
  const nsClient = await getCosmosNameServiceQueryClient(network.id);
  if (!nsClient || !userAddress) {
    return null;
  }

  let response;

  try {
    response = await nsClient.primaryAlias({ address: userAddress });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Primary alias not found not found")
    ) {
      return null;
    }
    throw err;
  }

  return response.username;
};

const gnoGetUsernameByAddress = async (
  network: GnoNetworkInfo,
  userAddress: string
) => {
  if (!userAddress) return null;

  if (userAddress.startsWith("gno.land/r/")) {
    return userAddress;
  }

  const provider = new GnoJSONRPCProvider(network.endpoint);

  const username = await provider.evaluateExpression(
    network.nameServiceContractAddress,
    `GetUserByAddress("${userAddress}").name`
  );
  const gnoUsename = extractGnoString(username);
  return `${gnoUsename}.gno`;
};

export const useNSPrimaryAlias = (userId: string | undefined) => {
  const { data, ...other } = useQuery(
    nsPrimaryAliasQueryKey(userId),
    async () => {
      if (!userId) {
        return null;
      }

      const [network, userAddress] = parseUserId(userId);
      if (!network) {
        return null;
      }

      switch (network.kind) {
        case NetworkKind.Cosmos:
          return cosmosGetUsernameByAddress(network, userAddress);
        case NetworkKind.Gno:
          return gnoGetUsernameByAddress(network, userAddress);
        default:
          return null;
      }
    },
    { staleTime: Infinity }
  );
  return { primaryAlias: data, ...other };
};

export const useNSPrimaryAliases = (userIds: string[] | undefined) => {
  const { data, ...other } = useQuery(
    nsPrimaryAliasQueryKey(userIds?.map((id) => id.slice(-3)).toString()),
    async () => {
      if (!userIds) return null;
      const aliases: AliasUserId[] = [];

      for (const userId of userIds) {
        if (!userId) {
          return null;
        }
        const [network, userAddress] = parseUserId(userId);
        if (!network) {
          return null;
        }
        let username: string | null = "";

        switch (network.kind) {
          case NetworkKind.Cosmos:
            username = await cosmosGetUsernameByAddress(network, userAddress);
            break;
          case NetworkKind.Gno:
            username = await gnoGetUsernameByAddress(network, userAddress);
            break;
          default:
            return null;
        }

        aliases.push({
          alias: username,
          userId,
        });
      }
      return aliases;
    },
    { staleTime: Infinity }
  );
  return { primaryAliases: data, ...other };
};
