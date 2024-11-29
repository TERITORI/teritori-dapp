import { useQuery } from "@tanstack/react-query";

import { getNetwork, NetworkKind } from "@/networks";
import { getCosmosSquadStakingQueryClient } from "@/utils/contracts";
import { getEthereumSquadStakingConfig } from "@/utils/game";
import { SquadConfig } from "@/utils/types/riot-p2e";

const getCosmosSquadStakingConfig = async (networkId: string | undefined) => {
  const cosmosClient = await getCosmosSquadStakingQueryClient(networkId);
  const config = await cosmosClient.getConfig();

  const squadConfig: SquadConfig = {
    bonusMultiplier: config.bonus_multiplier,
    cooldownPeriod: config.cooldown_period,
    maxSquadSize: config.min_squad_size,
    minSquadSize: config.min_squad_size,
    owner: config.owner,
    squadCountLimit: config.squad_count_limit,
  };

  return squadConfig;
};

export const useSquadStakingConfig = (networkId: string | undefined) => {
  return useQuery(
    ["squadStakingConfig", networkId],
    async (): Promise<SquadConfig> => {
      const network = getNetwork(networkId);

      switch (network?.kind) {
        case NetworkKind.Cosmos:
          return getCosmosSquadStakingConfig(networkId);
        case NetworkKind.Ethereum:
          return getEthereumSquadStakingConfig(networkId);
        default:
          throw Error(
            `network ${networkId} does not support get staking config`,
          );
      }
    },
    { staleTime: Infinity },
  );
};
