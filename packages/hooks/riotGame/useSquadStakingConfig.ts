import { useQuery } from "@tanstack/react-query";

import { getNetwork, NetworkKind } from "../../networks";
import {
  getCosmosSquadStakingQueryClient,
  getEthereumSquadStakingQueryClient,
} from "../../utils/contracts";
import { SquadConfig } from "./../../screens/RiotGame/types";

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

const getEthereumSquadStakingConfig = async (networkId: string | undefined) => {
  const ethereumClient = await getEthereumSquadStakingQueryClient(networkId);

  const squadConfig: SquadConfig = {
    bonusMultiplier: [100, 101, 102, 103, 104, 105],
    cooldownPeriod: 360,
    maxSquadSize: 6,
    minSquadSize: 1,
    owner: "owner",
    squadCountLimit: 2,
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
            `network ${networkId} does not support get staking config`
          );
      }
    },
    { staleTime: Infinity }
  );
};
