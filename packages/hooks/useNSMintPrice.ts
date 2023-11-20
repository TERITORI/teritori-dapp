import { useQuery } from "@tanstack/react-query";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getCosmosNetwork, mustGetNonSigningCosmWasmClient } from "../networks";

// TODO: move all ns hooks to a hooks/ns directory

export const useNSMintPrice = (
  networkId: string | undefined,
  tokenId: string,
) => {
  const { data, ...other } = useQuery(
    ["nsMintPrice", networkId, tokenId],
    async () => {
      if (tokenId !== tokenId.toLowerCase()) {
        return {
          denom: "unknown",
          amount: "0",
          invalid: true,
        };
      }

      if (!networkId) {
        return null;
      }
      const network = getCosmosNetwork(networkId);
      if (!network?.nameServiceContractAddress) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(networkId);

      const tnsClient = new TeritoriNameServiceQueryClient(
        client,
        network.nameServiceContractAddress,
      );

      const info = await tnsClient.contractInfo();

      try {
        const amount = await tnsClient.mintPrice({ tokenId });
        return {
          denom: info.native_denom,
          amount: amount?.toString() || "0",
          invalid: false,
        };
      } catch (e) {
        if (e instanceof Error && e.message.includes("Token Name Invalid")) {
          return { denom: info.native_denom, amount: "0", invalid: true };
        }
        throw e;
      }
    },
    { staleTime: Infinity },
  );

  return { nsMintPrice: data, ...other };
};
