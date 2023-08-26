import { useInfiniteQuery } from "@tanstack/react-query";

import {
  MusicAlbumInfo,
  GetAllAlbumListRequest,
} from "../../api/musicplayer/v1/musicplayer";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { AlbumInfo, AlbumMetadataInfo } from "../../utils/types/mediaPlayer";
import { useSelectedNetworkId } from "../useSelectedNetwork";
export type AlbumList = {
  list: AlbumInfo[];
  totalCount: number;
} | null;

export const combineFetchAlbumPages = (pages: AlbumList[]) =>
  pages.reduce((acc: AlbumInfo[], page) => [...acc, ...(page?.list || [])], []);

export const useFetchAlbums = (req: GetAllAlbumListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["albums", selectedNetworkId, { ...req }],
      async ({ pageParam = req.offset }) => {
        try {
          const postsRequest: GetAllAlbumListRequest = {
            ...req,
            offset: pageParam || 0,
          };
          // Getting Albums
          const musicAlbumList = await getMusicAlbums(
            selectedNetworkId,
            postsRequest
          );
          const albumInfoList: AlbumInfo[] = [];
          musicAlbumList.map((albumInfo) => {
            const metadata = JSON.parse(
              albumInfo.metadata
            ) as AlbumMetadataInfo;
            albumInfoList.push({
              id: albumInfo.identifier,
              name: metadata.title,
              description: metadata.description,
              createdBy: albumInfo.createdBy,
              image: metadata.image,
              audios: metadata.audios.map((a) => {
                return {
                  duration: a.duration * 1000, //ms
                  imageUrl: metadata.image,
                  name: a.name,
                  fileUrl: a.ipfs,
                  createdBy: albumInfo.createdBy,
                };
              }),
            } as AlbumInfo);
          });

          const totalCount = 1000; // test
          return { list: albumInfoList, totalCount } as AlbumList;
        } catch (err) {
          console.error("Error fetching albums", err);
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
  req: GetAllAlbumListRequest
) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const musicplayerClient = mustGetMusicplayerClient(networkId);
    const response = await musicplayerClient.GetAllAlbumList(req);
    // ---- We sort by creation date
    return response.musicAlbums;
  } catch (err) {
    console.error("Error fetching all albums list", err);
    return [] as MusicAlbumInfo[];
  }
};
