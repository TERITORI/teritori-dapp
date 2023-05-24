import { useQuery } from "@tanstack/react-query";

import { TeritoriNftVaultQueryClient } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import {
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";

export const useVaultConfig = (networkId: string) => {
  const network = getCosmosNetwork(networkId);
  const { data: vaultConfig, ...other } = useQuery(
    ["vaultConfig", networkId, network?.vaultContractAddress],
    async () => {
      if (!network?.vaultContractAddress) {
        return undefined;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new TeritoriNftVaultQueryClient(
        cosmwasmClient,
        network.vaultContractAddress
      );
      return await client.config();
    }
  );
  return { vaultConfig, ...other };
};
