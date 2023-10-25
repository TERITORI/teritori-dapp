import { useQuery } from "@tanstack/react-query";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { mustGetVideoClient } from "../../utils/backend";

export const useFetchLibraryIds = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { data, isFetching, isLoading } = useQuery(
    ["videoLibraryIds", selectedNetworkId, userId],
    async () => {
      try {
        if (!userId) return [];
        const res = await mustGetVideoClient(
          selectedNetworkId
        ).GetVideoListForLibrary({
          user: userId,
        });
        const idList: string[] = [];
        res.videoInfos.map((videoInfo) => {
          idList.push(videoInfo.identifier);
        });
        return idList;
      } catch {
        return [];
      }
    }
  );
  return { data, isFetching, isLoading };
};
