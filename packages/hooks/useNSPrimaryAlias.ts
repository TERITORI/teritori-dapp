import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import {
  CosmosNetworkInfo,
  GnoNetworkInfo,
  NetworkKind,
  mustGetCosmosNetwork,
  mustGetGnoNetwork,
  parseUserId,
} from "../networks";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";
import { extractGnoString } from "../utils/gno";

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

  try {
    const provider = new GnoJSONRPCProvider(network.endpoint);
    const username = await provider.evaluateExpression(
      "gno.land/r/demo/users",
      `GetUserByAddress("${userAddress}").name`
    );
    return extractGnoString(username);
  } catch (err) {
    throw err;
  }
};

export const useNSPrimaryAlias = (userId: string | undefined) => {
  const { data, ...other } = useQuery(
    nsPrimaryAliasQueryKey(userId),
    async () => {
      if (!userId) {
        return null;
      }

      const [network, userAddress] = parseUserId(userId);

      if (network?.kind === NetworkKind.Cosmos) {
        const cosmosNetwork = mustGetCosmosNetwork(network?.id);
        return cosmosGetUsernameByAddress(cosmosNetwork, userAddress);
      } else if (network?.kind === NetworkKind.Gno) {
        const gnoNetwork = mustGetGnoNetwork(network?.id);
        return gnoGetUsernameByAddress(gnoNetwork, userAddress);
      }

      return null;
    },
    { staleTime: Infinity }
  );
  return { primaryAlias: data, ...other };
};
