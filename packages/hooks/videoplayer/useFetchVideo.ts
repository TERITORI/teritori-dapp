import { useQuery } from "@tanstack/react-query";

import { GetVideoRequest } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useFetchVideo = (req: GetVideoRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, isLoading } = useQuery(
    ["video", selectedNetworkId, { ...req }],
    async () => {
      try {
        const videoClient = mustGetVideoClient(selectedNetworkId);
        const response = await videoClient.GetVideo(req);
        // ---- We sort by creation date
        const videoInfo = response.videoInfo;
        // const videoInfo = {
        //   identifier: "1",
        //   metadata:
        //     '{"url": "QmYh81zHS7JGaZdtwmxixtML6yCQgKwZWSWSXsYgU1cXB2", "image": "https://hips.hearstapps.com/hmg-prod/images/graphic-illustration-of-the-earth-and-the-sun-royalty-free-image-1679061019.jpg?crop=1.00xw:1.00xh;0,0&resize=1200:*", "title": "Cosmos adventures - Part 1. All around the sun", "duration": 5535632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
        //   createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
        //   createdAt: 1697302641,
        //   viewCount: 23,
        //   like: 12,
        //   dislike: 4,
        // };
        if (!videoInfo) return null;
        const metadata = JSON.parse(videoInfo.metadata);
        // metadata.description =
        //   "Dans l'obscurité sans fin de l'espace, des milliards d'étoiles scintillent comme des diamants éparpillés sur un tapis de velours noir. Le silence qui règne ici est à la fois paisible et terrifiant. Les planètes, des mondes en orbite, semblent flotter dans cette immensité cosmique, chacune avec son propre caractère et sa propre histoire.\n" +
        //   "\n" +
        //   "À des millions de kilomètres de la Terre, une station spatiale avance lentement dans le vide. À son bord, une équipe d'astronautes s'affaire à des expériences scientifiques, à l'observation des étoiles et à la maintenance de la station. Ils sont les pionniers modernes, explorant l'inconnu avec courage.";
        return {
          id: videoInfo.identifier,
          createdBy: videoInfo.createdBy,
          videoMetaInfo: metadata,
          createdAt: videoInfo.createdAt,
          viewCount: videoInfo.viewCount,
          like: videoInfo.like,
          dislike: videoInfo.dislike,
        } as VideoInfoWithMeta;
      } catch {
        //TODO: error handling/feedback
        return null;
      }
    },
  );
  return { data, isFetching, isLoading };
};
