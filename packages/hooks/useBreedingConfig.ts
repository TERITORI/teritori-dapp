import { useQuery } from "@tanstack/react-query";

import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useBreedingConfig = () => {
  const { data } = useQuery(
    ["breedingConfig"],
    async () => {
      const cosmwasmClient = await getNonSigningCosmWasmClient();

      const breedingClient = new TeritoriBreedingQueryClient(
        cosmwasmClient,
        process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS || ""
      );

      const conf = await breedingClient.config();

      return conf;
    },
    { staleTime: Infinity }
  );
  return data;
};
