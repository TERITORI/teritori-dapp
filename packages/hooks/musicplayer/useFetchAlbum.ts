import { useQuery } from "@tanstack/react-query";

import { GetAlbumRequest } from "../../api/musicplayer/v1/musicplayer";
import { parseNetworkObjectId } from "../../networks";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { musicAlbumInfoToAlbumInfo } from "../../utils/types/mediaPlayer";

export const useFetchAlbum = (req: GetAlbumRequest) => {
  const { data, isFetching, isLoading } = useQuery(
    ["music-album", req],
    async () => {
      try {
        const [network] = parseNetworkObjectId(req.identifier);
        const res = await mustGetMusicplayerClient(network?.id).GetAlbum({
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
