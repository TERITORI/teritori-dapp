import { useQuery } from "@tanstack/react-query";

import { GetAlbumRequest } from "../../api/musicplayer/v1/musicplayer";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { musicAlbumInfoToAlbumInfo } from "../../utils/types/mediaPlayer";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useFetchAlbum = (req: GetAlbumRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, isLoading } = useQuery(
    ["music-album", selectedNetworkId, { ...req }],
    async () => {
      try {
        const res = await mustGetMusicplayerClient(selectedNetworkId).GetAlbum({
          identifier: req.identifier,
        });
        const musicAlbum = res.musicAlbum;
        if (musicAlbum) {
          return musicAlbumInfoToAlbumInfo(musicAlbum);
        } else {
          return null;
        }
      } catch {
        return null;
      }
    }
  );
  return { data, isFetching, isLoading };
};
