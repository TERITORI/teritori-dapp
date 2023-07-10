import { useQuery } from "@tanstack/react-query";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../networks";

export const useTNSMintPrice = (
  networkId: string | undefined,
  tokenId: string
) => {
  const { data } = useQuery(
    ["tnsMintPrice", networkId, tokenId],
    async () => {
      if (!networkId) {
        return null;
      }
      const network = mustGetCosmosNetwork(networkId);
      if (!network.nameServiceContractAddress) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(networkId);

      const tnsClient = new TeritoriNameServiceQueryClient(
        client,
        network.nameServiceContractAddress
      );
      console.log("fetching price for", tokenId);

      const info = await tnsClient.contractInfo();

      const amount = await tnsClient.mintPrice({ tokenId });

      return { denom: info.native_denom, amount: amount?.toString() || "0" };
    },
    { staleTime: Infinity }
  );

  return data;
};
