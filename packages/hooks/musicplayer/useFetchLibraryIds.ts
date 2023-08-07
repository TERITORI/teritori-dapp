import { useQuery } from "@tanstack/react-query";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { mustGetMusicplayerClient } from "../../utils/backend";

export const useFetchLibraryIds = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { data, isFetching, isLoading } = useQuery(
    ["library_ids", selectedNetworkId, userId],
    async () => {
      try {
        if (!userId) return [];
        const res = await mustGetMusicplayerClient(
          selectedNetworkId
        ).GetAlbumIdListForLibrary({
          user: userId,
        });
        const idList: string[] = [];
        res.albumLibraries.map((libraryInfo) => {
          idList.push(libraryInfo.identifier);
        });
        return idList;
      } catch {
        return [];
      }
    }
  );
  return { data, isFetching, isLoading };
};
