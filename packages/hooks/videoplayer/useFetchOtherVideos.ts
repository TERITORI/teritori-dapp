import { useInfiniteQuery } from "@tanstack/react-query";

import { VideosList } from "./useFetchVideos";
import {
  GetVideoListForLibraryRequest,
  VideoInfo,
} from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { VideoInfoWithMeta, VideoMetaInfo } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const combineFetchVideoPages = (pages: VideosList[]) =>
  pages.reduce(
    (acc: VideoInfoWithMeta[], page) => [...acc, ...(page?.list || [])],
    []
  );

export const useFetchOtherVideos = (req: GetVideoListForLibraryRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["otherVideos", selectedNetworkId, { ...req }],
      async () => {
        try {
          const postsRequest: GetVideoListForLibraryRequest = {
            ...req,
          };
          const videoList = await getVideos(selectedNetworkId, postsRequest);
          const videoInfos: VideoInfoWithMeta[] = [];
          videoList.map((videoInfo) => {
            const metadata = JSON.parse(videoInfo.metadata) as VideoMetaInfo;
            videoInfos.push({
              id: videoInfo.identifier,
              videoMetaInfo: metadata,
              createdBy: videoInfo.createdBy,
              createdAt: videoInfo.createdAt,
              viewCount: videoInfo.viewCount,
              like: videoInfo.like,
              dislike: videoInfo.dislike,
            } as VideoInfoWithMeta);
          });
          //TODO: Pagination ?
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

const getVideos = async (
  networkId: string,
  req: GetVideoListForLibraryRequest
): Promise<VideoInfo[]> => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const videoClient = mustGetVideoClient(networkId);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
    const response = await videoClient.GetVideoListForLibrary(req);
    console.log("YYYYYYYYYYYYYYYYYYYYYY", response);

    // ---- We sort by creation date
    return response.videoInfos;
  } catch (err) {
    console.log("initData err", err);
    return [];
  }
};
