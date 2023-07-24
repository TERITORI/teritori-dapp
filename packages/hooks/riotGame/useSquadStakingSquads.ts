import { useQuery } from "@tanstack/react-query";

import { NetworkKind } from "./../../networks/types";
import { parseUserId } from "../../networks";
import { SquadInfo } from "../../screens/RiotGame/types";
import {
  getEthereumSquadStakingQueryClient,
  getCosmosSquadStakingQueryClient,
} from "../../utils/contracts";

const cosmosGetSquads = async (
  networkId: string,
  user: string
): Promise<SquadInfo[]> => {
  const queryClient = await getCosmosSquadStakingQueryClient(networkId);
  const res = await queryClient.getSquad({ owner: user });

  return res.map((squad) => ({
    index: 0, // we do not need this info in Cosmos
    endTime: squad.end_time,
    startTime: squad.start_time,
    nfts: squad.nfts.map((nft) => ({
      contract: nft.contract_addr,
      tokenId: nft.token_id,
    })),
  }));
};

const ethereumGetSquads = async (
  networkId: string,
  user: string
): Promise<SquadInfo[]> => {
  const queryClient = await getEthereumSquadStakingQueryClient(networkId);
  const res = await queryClient.callStatic.userSquadInfo(user);

  return res.map((squad) => ({
    index: squad.index.toNumber(),
    endTime: squad.endTime.toNumber(),
    startTime: squad.startTime.toNumber(),
    nfts: squad.nfts.map((nft) => ({
      contract: nft.collection,
      tokenId: nft.tokenId.toString(),
    })),
  }));
};

export const useSquadStakingSquads = (userId: string | undefined) => {
  return useQuery(
    ["squadStakingSquadsV2", userId],
    async (): Promise<SquadInfo[]> => {
      const [network, address] = parseUserId(userId);
      if (!network || !address) {
        return [];
      }
      const networkId = network.id;

      try {
        switch (network.kind) {
          case NetworkKind.Cosmos:
            return cosmosGetSquads(networkId, address);
          case NetworkKind.Ethereum:
            return ethereumGetSquads(networkId, address);
          default:
            throw Error(`network ${networkId} does not support get squad`);
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes("Squad not found")) {
          return [];
        }

        throw e;
      }
    },
    { initialData: [] }
  );
};
