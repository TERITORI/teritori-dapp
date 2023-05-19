import { useQuery } from "@tanstack/react-query";

import { getAvailableFreePost } from "../../components/MusicPlayer/MusicplayerQueries";
import { Wallet } from "../../context/WalletsProvider";
import { MusicAlbumCategory } from "../../utils/types/music";

export const useUpdateAvailableFreePost = (
  networkId: string,
  postCategory: MusicAlbumCategory,
  wallet?: Wallet
) => {
  const { data } = useQuery(
    ["getAvailableFreePost", networkId, postCategory, wallet?.address],
    async () => {
      try {
        return (
          (await getAvailableFreePost({
            networkId,
            wallet,
          })) || 0
        );
      } catch (e) {
        console.error("getAvailableFreePost failed :", e);
        return 0;
      }
    },
    { staleTime: Infinity }
  );
  return { freePostCount: data || 0 };
};
