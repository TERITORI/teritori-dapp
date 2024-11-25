import { useQuery } from "@tanstack/react-query";

import { NetworkKind, getUserId, parseUserId } from "@/networks";
import {
  getEthereumSquadStakingQueryClient,
  getCosmosSquadStakingQueryClient,
} from "@/utils/contracts";
import { estimateStakingDurationManually } from "@/utils/game";
import { SquadInfo } from "@/utils/types/riot-p2e";

const cosmosGetSquads = async (
  networkId: string,
  user: string,
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
  user: string,
): Promise<SquadInfo[]> => {
  const queryClient = await getEthereumSquadStakingQueryClient(networkId);
  const res = await queryClient.callStatic.userSquadInfo(user);

  const promises = res.map(async (squad) => {
    let endTime = squad.endTime.toNumber();
    const startTime = squad.startTime.toNumber();
    const nfts = squad.nfts.map((nft) => ({
      contract: nft.collection,
      tokenId: nft.tokenId.toString(),
    }));

    // PATCH: If on polygon and startTime = endTime that means we are not able to fetch metadata
    // then we will calculate manually the info here
    if (networkId === "polygon" && startTime === endTime) {
      const userId = getUserId(networkId, user);
      const duration = await estimateStakingDurationManually(userId, nfts);
      endTime = startTime + Math.round(duration / 1000);
    }

    return {
      index: squad.index.toNumber(),
      endTime,
      startTime,
      nfts,
    };
  });

  return await Promise.all(promises);
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
    { initialData: [] },
  );
};
