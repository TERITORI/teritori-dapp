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

export const useFetchUserVideos = (req: GetUserVideoListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["user_videos", selectedNetworkId, { ...req }],

      async ({ pageParam = req.offset }) => {
        //   try {
        //     // const postsRequest: GetUserVideoListRequest = {
        //     //   ...req,
        //     //   offset: pageParam || 0,
        //     // };
        //     // Getting Albums
        //     // const videoList = await getVideos(selectedNetworkId, postsRequest);
        //     const videoList = [
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //       {
        //         identifier: "1",
        //         metadata:
        //           '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //         createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //         createdAt: 1697302641,
        //         viewCount: 23,
        //         like: 12,
        //         dislike: 4,
        //       },
        //     ];
        //
        //     // const videoInfo = {
        //     //   identifier: "1",
        //     //   metadata:
        //     //     '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //     //   createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //     //   createdAt: 1697302641,
        //     //   viewCount: 23,
        //     //   like: 12,
        //     //   dislike: 4,
        //     // };
        //     // if (!videoInfo) return null;
        //     // const metadata = JSON.parse(videoInfo.metadata);
        //     // metadata.description = "Dans l'obscurité sans fin de l'espace, des milliards d'étoiles scintillent comme des diamants éparpillés sur un tapis de velours noir. Le silence qui règne ici est à la fois paisible et terrifiant. Les planètes, des mondes en orbite, semblent flotter dans cette immensité cosmique, chacune avec son propre caractère et sa propre histoire.\n" +
        //     //   "\n" +
        //     //   "À des millions de kilomètres de la Terre, une station spatiale avance lentement dans le vide. À son bord, une équipe d'astronautes s'affaire à des expériences scientifiques, à l'observation des étoiles et à la maintenance de la station. Ils sont les pionniers modernes, explorant l'inconnu avec courage."
        //
        //     const videoInfos: VideoInfoWithMeta[] = [];
        //     videoList.map((videoInfo) => {
        //       const metadata = JSON.parse(videoInfo.metadata) as VideoMetaInfo;
        //       metadata.description = "Dans l'obscurité sans fin de l'espace, des milliards d'étoiles scintillent comme des diamants éparpillés sur un tapis de velours noir. Le silence qui règne ici est à la fois paisible et terrifiant. Les planètes, des mondes en orbite, semblent flotter dans cette immensité cosmique, chacune avec son propre caractère et sa propre histoire.\n" +
        //         "\n" +
        //         "À des millions de kilomètres de la Terre, une station spatiale avance lentement dans le vide. À son bord, une équipe d'astronautes s'affaire à des expériences scientifiques, à l'observation des étoiles et à la maintenance de la station. Ils sont les pionniers modernes, explorant l'inconnu avec courage."
        //
        //       videoInfos.push({
        //         id: videoInfo.identifier,
        //         videoMetaInfo: metadata,
        //         createdBy: videoInfo.createdBy,
        //         // createdAt: new Date(videoInfo.createdAt * 1000).toISOString(),
        //         createdAt: videoInfo.createdAt,
        //         viewCount: videoInfo.viewCount,
        //         like: videoInfo.like,
        //         dislike: videoInfo.dislike,
        //       } as VideoInfoWithMeta);
        //     });
        //
        //     //TODO: Pagination ?
        //     const totalCount = 1000; // test
        //     return { list: videoInfos, totalCount } as VideosList;
        //   }
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
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "2a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "3a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "4a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "5a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "6a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "7a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "8a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "9a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
            {
              identifier: "10a",
              metadata:
                '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
              createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
              createdAt: 1697302641,
              viewCount: 23,
              like: 12,
              dislike: 4,
            },
          ];
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
