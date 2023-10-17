import { useInfiniteQuery } from "@tanstack/react-query";

import { GetVideoListRequest } from "../../api/video/v1/video";
import { VideoInfoWithMeta, VideoMetaInfo } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export type VideosList = {
  list: VideoInfoWithMeta[];
  totalCount: number;
} | null; //TODO: Really need |null ?

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
          // const postsRequest: GetVideoListRequest = {
          //   ...req,
          //   offset: pageParam || 0,
          // };
          // const videoList = await getVideos(selectedNetworkId, postsRequest);
          const videoList = [
            {
              identifier: "1",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "QmVdp2SNDsNK9jU7Rce6J8BL9FqNRiVzrgZSVyd8ygM1yT", "title": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb", "duration": 0, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
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
//   req: GetVideoListRequest
// ): Promise<VideoInfo[]> => {
//   try {
//     // ===== We use FeedService to be able to fetch filtered posts
//     const videoClient = mustGetVideoClient(networkId);
//     const response = await videoClient.GetVideoList(req);
//     // ---- We sort by creation date
//     return response.videoInfos;
//   } catch (err) {
//     console.log("initData err", err);
//     return [];
//   }
// };
