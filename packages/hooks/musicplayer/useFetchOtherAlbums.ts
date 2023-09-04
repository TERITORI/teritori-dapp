import { useInfiniteQuery } from "@tanstack/react-query";

import {
  MusicAlbumInfo,
  GetOtherAlbumListRequest,
} from "../../api/musicplayer/v1/musicplayer";
import { mustGetMusicplayerClient } from "../../utils/backend";
import {
  AlbumInfo,
  AlbumList,
  musicAlbumInfoToAlbumInfo,
} from "../../utils/types/mediaPlayer";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const combineFetchAlbumPages = (pages: AlbumList[]) =>
  pages.reduce((acc: AlbumInfo[], page) => [...acc, ...(page?.list || [])], []);

export const useFetchOtherAlbums = (req: GetOtherAlbumListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["albums", selectedNetworkId, { ...req }],
      async ({ pageParam = req.offset }) => {
        try {
          const postsRequest: GetOtherAlbumListRequest = {
            ...req,
            offset: pageParam || 0,
          };
          // Getting Albums
          const musicAlbumList = await getMusicAlbums(
            selectedNetworkId,
            postsRequest
          );
          const albumInfoList: AlbumInfo[] = musicAlbumList.map((albumInfo) =>
            musicAlbumInfoToAlbumInfo(albumInfo)
          );
          const totalCount = 1000; // test
          return { list: albumInfoList, totalCount } as AlbumList;
        } catch (err) {
          console.error("initData err", err);
          return { list: [], totalCount: 0 } as AlbumList;
        }
      },
      {
        getNextPageParam: (lastPage, pages) => {},
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      }
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};

const getMusicAlbums = async (
  networkId: string,
  req: GetOtherAlbumListRequest
) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const musicplayerClient = mustGetMusicplayerClient(networkId);
    const response = await musicplayerClient.GetOtherAlbumList(req);
    // ---- We sort by creation date
    return response.musicAlbums;
  } catch (err) {
    console.log("initData err", err);
    return [] as MusicAlbumInfo[];
  }
};
