import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";

import { WEI_TOKEN_ADDRESS } from "../networks";
import { backendClient } from "../utils/backend";
import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

export const useCollectionStats = (collectionId: string, address?: string) => {
  // TODO: Should find a way to detect network info based on function args
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const networkId = selectedNetworkInfo?.id;

  const addressPrefix = collectionId.split("-")[0];

  const coins =
    addressPrefix === "eth" ? [{ networkId, denom: WEI_TOKEN_ADDRESS }] : [];

  const { prices } = useCoingeckoPrices(coins);

  const ownerId = `${addressPrefix}-${address}`;

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
    if (!data || addressPrefix !== "eth") return data;

    const ether = ethers.utils.formatEther(
      BigNumber.from(data.totalVolume || 0)
    );
    return {
      ...data,
      totalVolume: `${+ether * usdPrice}`,
    };
  }, [usdPrice, collectionId, data]);

  return adjustedData;
};
