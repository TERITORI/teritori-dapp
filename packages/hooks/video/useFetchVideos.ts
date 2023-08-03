import { useInfiniteQuery } from "@tanstack/react-query";

import { VideoInfo, GetVideoListRequest } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { VideoInfoWithMeta, VideoMetaInfo } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export type VideosList = {
  list: VideoInfoWithMeta[];
  totalCount: number;
} | null;

export const combineFetchVideoPages = (pages: VideosList[]) =>
  pages.reduce(
    (acc: VideoInfoWithMeta[], page) => [...acc, ...(page?.list || [])],
    []
  );

export const useFetchVideos = (req: GetVideoListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["videos", selectedNetworkId, { ...req }],
      async ({ pageParam = req.offset }) => {
        try {
          const postsRequest: GetVideoListRequest = {
            ...req,
            offset: pageParam || 0,
          };
          // Getting Albums
          const videoList = await getVideos(selectedNetworkId, postsRequest);
          const videoInfos: VideoInfoWithMeta[] = [];
          videoList.map((videoInfo) => {
            const metadata = JSON.parse(videoInfo.metadata) as VideoMetaInfo;
            videoInfos.push({
              identifier: videoInfo.identifier,
              videoMetaInfo: metadata,
              createdBy: videoInfo.createdBy,
            } as VideoInfoWithMeta);
          });

          const totalCount = 1000; // test
          return { list: videoInfos, totalCount } as VideosList;
        } catch (err) {
          console.error("initData err", err);
          return { list: [], totalCount: 0 } as VideosList;
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
const getVideos = async (networkId: string, req: GetVideoListRequest) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const videoClient = mustGetVideoClient(networkId);
    const response = await videoClient.GetVideoList(req);
    // ---- We sort by creation date
    return response.videoInfos;
  } catch (err) {
    console.log("initData err", err);
    return [] as VideoInfo[];
  }
};
