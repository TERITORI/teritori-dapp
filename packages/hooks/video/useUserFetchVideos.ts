import { useInfiniteQuery } from "@tanstack/react-query";

import { VideosList } from "./useFetchVideos";
import { GetUserVideoListRequest } from "../../api/video/v1/video";
import { VideoMetaInfo, VideoInfoWithMeta } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const combineFetchVideoPages = (pages: VideosList[]) =>
  pages.reduce(
    (acc: VideoInfoWithMeta[], page) => [...acc, ...(page?.list || [])],
    []
  );

export const useUserFetchVideos = (req: GetUserVideoListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["user_videos", selectedNetworkId, { ...req }],
      async ({ pageParam = req.offset }) => {
        try {
          // const postsRequest: GetUserVideoListRequest = {
          //   ...req,
          //   offset: pageParam || 0,
          // };
          // Getting Albums
          // const videoList = await getVideos(selectedNetworkId, postsRequest);
          const videoList = [
            {
              identifier: "1",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "QmTChqp83bu9faWsaBjF6Azr4yAzQqws3pUAHyZjfvLzu9", "title": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb", "duration": 0, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 0,
              like: 0,
              dislike: 0,
            },
          ];
          const videoInfos: VideoInfoWithMeta[] = [];
          videoList.map((videoInfo) => {
            const metadata = JSON.parse(videoInfo.metadata) as VideoMetaInfo;
            videoInfos.push({
              id: videoInfo.identifier,
              videoMetaInfo: metadata,
              createdBy: videoInfo.createdBy,
              // createdAt: new Date(videoInfo.createdAt * 1000).toISOString(),
              createdAt: videoInfo.createdAt,
              viewCount: videoInfo.viewCount,
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

// const getVideos = async (
//   networkId: string,
//   req: GetUserVideoListRequest
// ): Promise<VideoInfo[]> => {
//   try {
//     // ===== We use FeedService to be able to fetch filtered posts
//     const videoClient = mustGetVideoClient(networkId);
//     const response = await videoClient.GetUserVideoList(req);
//     // ---- We sort by creation date
//     return response.videoInfos;
//   } catch (err) {
//     console.log("initData err", err);
//     return [];
//   }
// };
