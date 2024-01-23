import { useQuery } from "@tanstack/react-query";

import { TeritoriSquadStakingQueryClient } from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import { Squad } from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import {
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";

export const getSquadStakingSquadsV1QueryKey = (userId: string | undefined) => {
  return ["squadStakingSquadsV1", userId];
};

export const useSquadStakingSquadsV1 = (userId: string | undefined) => {
  return useQuery(
    getSquadStakingSquadsV1QueryKey(userId),
    async () => {
      try {
        const [network, address] = parseUserId(userId);
        if (!network || !address) {
          return null;
        }

        const contractAddress = getCosmosNetwork(network.id)
          ?.riotSquadStakingContractAddressV1;

        if (!contractAddress) {
          return null;
        }

        const nonSigningClient = await mustGetNonSigningCosmWasmClient(
          network.id,
        );
        const client = new TeritoriSquadStakingQueryClient(
          nonSigningClient,
          contractAddress,
        );
        const squad = await client.getSquad({
          owner: address,
        });

        // NOTE: contract client V1 is not compatible with V2
        // V1 return Squad and V2 return Squad[] so we have to use any in this case
        return squad as unknown as Squad;
      } catch (e) {
        if (e instanceof Error && e.message.includes("Squad not found")) {
          return null;
        } else {
          throw e;
        }
      }
    },
    { staleTime: Infinity },
  );
};
