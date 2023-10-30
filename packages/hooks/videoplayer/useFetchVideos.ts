import { useInfiniteQuery } from "@tanstack/react-query";

import { GetVideoListRequest, VideoInfo } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { VideoInfoWithMeta, VideoMetaInfo } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export type VideosList = {
  list: VideoInfoWithMeta[];
  totalCount: number;
};

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
          const videoList = await getVideos(selectedNetworkId, postsRequest);

          // const videoList = [
          //   {
          //     identifier: "1",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "2a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "3a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "4a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "5a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "6a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "7a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "8a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "9a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          //   {
          //     identifier: "10a",
          //     metadata:
          //       '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          //     createdAt: 1697302641,
          //     viewCount: 23,
          //     like: 12,
          //     dislike: 4,
          //   },
          // ];
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
  req: GetVideoListRequest
): Promise<VideoInfo[]> => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const videoClient = mustGetVideoClient(networkId);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
    const response = await videoClient.GetVideoList(req);
    console.log("YYYYYYYYYYYYYYYYYYYYYY", response);

    // ---- We sort by creation date
    return response.videoInfos;
  } catch (err) {
    console.log("initData err", err);
    return [];
  }
};
