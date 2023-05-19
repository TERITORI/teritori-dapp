import { useQuery } from "@tanstack/react-query";

import { getPostFee } from "../../components/MusicPlayer/MusicplayerQueries";
import { MusicAlbumCategory } from "../../utils/types/music";

export const useUpdatePostFee = (
  networkId: string,
  postCategory: MusicAlbumCategory
) => {
  const { data } = useQuery(
    ["getPostFee", networkId, postCategory],
    async () => {
      try {
        return (
          (await getPostFee({
            networkId,
            postCategory,
          })) || 0
        );
      } catch (e) {
        console.error("getPostFee failed: ", e);
        return 0;
      }
    },
    { staleTime: Infinity }
  );
  return { postFee: data || 0 };
};
