import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";

import { backendClient } from "../utils/backend";
import { Network } from "./../utils/network";
import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

export const useCollectionStats = (collectionId: string, address?: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const networkId = selectedNetworkInfo?.id;
  const network = selectedNetworkInfo?.network;
  const coins =
    network === Network.Ethereum ? [{ networkId, denom: "wei" }] : [];

  const { prices } = useCoingeckoPrices(coins);

  const ownerId = useMemo(() => {
    if (!address) return;
    switch (network) {
      case Network.Teritori:
        return `tori-${address}`;
      case Network.Ethereum:
        return `eth-${address}`;
      default:
        return undefined;
    }
  }, [networkId, address]);

  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId],
    async () => {
      const { stats } = await backendClient.CollectionStats({
        collectionId,
        ownerId,
        networkId,
      });

      // TODO: If ethereum then consider that denom is wei for now, handle dynamic denom later
      if (stats && network === Network.Ethereum) {
        const ether = ethers.utils.formatEther(
          BigNumber.from(stats.totalVolume)
        );

        stats.totalVolume = `${+ether * prices["ethereum"]["usd"]}`;
      }

      return stats;
    }
  );
  return data;
};
