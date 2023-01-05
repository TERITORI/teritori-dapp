import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";

import { WEI_TOKEN_ADDRESS } from "../networks";
import { backendClient } from "../utils/backend";
import { Network } from "./../utils/network";
import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

export const useCollectionStats = (collectionId: string, address?: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const networkId = selectedNetworkInfo?.id;
  const network = selectedNetworkInfo?.network;
  const coins =
    network === Network.Ethereum
      ? [{ networkId, denom: WEI_TOKEN_ADDRESS }]
      : [];

  const { prices } = useCoingeckoPrices(coins);

  const ownerId = `${selectedNetworkInfo?.addressPrefix}-${address}`;

  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId],
    async () => {
      const { stats } = await backendClient.CollectionStats({
        collectionId,
        ownerId,
        networkId,
      });

      return stats;
    }
  );

  const usdPrice = prices["ethereum"]?.["usd"] || 0;
  const adjustedData = useMemo(() => {
    if (!data || network !== Network.Ethereum) return data;

    const ether = ethers.utils.formatEther(BigNumber.from(data.totalVolume));
    return {
      ...data,
      totalVolume: `${+ether * usdPrice}`,
    };
  }, [usdPrice, network, data]);

  return adjustedData;
};
