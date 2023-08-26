import { useQuery } from "@tanstack/react-query";

import { GetAlbumRequest } from "../../api/musicplayer/v1/musicplayer";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { AlbumMetadataInfo, AlbumInfo } from "../../utils/types/mediaPlayer";
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
          const metadata = JSON.parse(musicAlbum.metadata) as AlbumMetadataInfo;
          const albumInfo: AlbumInfo = {
            id: musicAlbum.identifier,
            description: metadata.description,
            image: metadata.image,
            createdBy: musicAlbum.createdBy,
            name: metadata.title,
            audios: metadata.audios.map((a) => {
              return {
                duration: a.duration * 1000, //ms,
                imageUrl: metadata.image,
                name: a.name,
                fileUrl: a.ipfs,
                createdBy: musicAlbum.createdBy,
              };
            }),
          };
          return albumInfo;
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
