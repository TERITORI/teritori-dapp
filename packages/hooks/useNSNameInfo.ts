import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { GnoDAORegistration } from "./gno/useGnoDAOs";
import {
  Metadata,
  NftInfoResponse,
} from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { GnoNetworkInfo, NetworkKind, getNetwork } from "../networks";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";
import { extractGnoJSONString, extractGnoString } from "../utils/gno";

export const nsNameInfoQueryKey = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
) => ["nsNameInfo", networkId, tokenId];

export const useNSNameInfo = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
  enabled?: boolean,
) => {
  const { data: nsInfo, ...other } = useQuery(
    nsNameInfoQueryKey(networkId, tokenId),
    async () => {
      if (!tokenId) {
        return null;
      }

      const network = getNetwork(networkId);
      if (!network) {
        return null;
      }

      switch (network?.kind) {
        case NetworkKind.Cosmos: {
          const nsClient = await getCosmosNameServiceQueryClient(networkId);
          if (!nsClient) {
            return null;
          }

          let nftInfo;

          try {
            nftInfo = await nsClient.nftInfo({
              tokenId,
            });
          } catch (err) {
            if (err instanceof Error && err.message.includes("not found")) {
              return null;
            }
            throw err;
          }

          return nftInfo;
        }
        case NetworkKind.Gno: {
          if (!tokenId.startsWith("gno.land/") && tokenId.endsWith(".gno")) {
            const address = await gnoGetAddressByUsername(
              network,
              tokenId.slice(0, -".gno".length),
            );
            if (!address) {
              return null;
            }
            const res: NftInfoResponse = {
              extension: {},
            };
            return res;
          }
          if (!tokenId.startsWith("gno.land/")) {
            return null;
          }
          if (!network.daoRegistryPkgPath) {
            return null;
          }
          const provider = new GnoJSONRPCProvider(network.endpoint);
          const query = `GetJSON(${JSON.stringify(tokenId)})`;
          const res: GnoDAORegistration = extractGnoJSONString(
            await provider.evaluateExpression(
              network.daoRegistryPkgPath,
              query,
            ),
          );
          const data: Metadata = {
            public_name: res.name,
            public_bio: res.description,
            image: res.imageURI,
          };
          const user: NftInfoResponse = {
            extension: data,
          };
          return user;
        }
      }
    },
    { staleTime: Infinity, enabled },
  );
  return { nsInfo, notFound: nsInfo === null, ...other };
};

const gnoGetAddressByUsername = async (
  network: GnoNetworkInfo,
  name: string,
) => {
  if (!name) return null;

  const provider = new GnoJSONRPCProvider(network.endpoint);

  try {
    const res = await provider.evaluateExpression(
      network.nameServiceContractAddress,
      `GetUserByName(${JSON.stringify(name)}).address`,
    );
    const address = extractGnoString(res);
    return address;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("ABCI response is not initialized")
    ) {
      // not registered
      return null;
    }
    throw err;
  }
};
