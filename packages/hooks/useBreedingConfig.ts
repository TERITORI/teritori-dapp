import { useQuery } from "@tanstack/react-query";

import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { getCosmosNetwork, mustGetNonSigningCosmWasmClient } from "../networks";

export const useBreedingConfig = (
  networkId: string | undefined,
  enabled?: boolean,
) => {
  if (enabled === undefined) {
    enabled = true;
  }

  const { data, ...other } = useQuery(
    ["breedingConfig", networkId],
    async () => {
      if (!networkId) {
        return null;
      }

      const breedingContractAddress =
        getCosmosNetwork(networkId)?.riotContractAddressGen1;
      if (!breedingContractAddress) {
        return null;
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);

      const breedingClient = new TeritoriBreedingQueryClient(
        cosmwasmClient,
        breedingContractAddress,
      );

      const conf = await breedingClient.config();

      return conf;
    },
    { staleTime: Infinity, enabled: enabled && !!networkId },
  );
  return { breedingConfig: data, ...other };
};
