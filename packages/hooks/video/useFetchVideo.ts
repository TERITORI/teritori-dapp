import { useQuery } from "@tanstack/react-query";

import { GetVideoRequest } from "../../api/video/v1/video";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useFetchVideo = (req: GetVideoRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, isLoading } = useQuery(
    ["video", selectedNetworkId, { ...req }],
    async () => {
      try {
        // const videoClient = mustGetVideoClient(selectedNetworkId);
        // const response = await videoClient.GetVideo(req);
        // ---- We sort by creation date
        // const videoInfo = response.videoInfo;
        const videoInfo = {
          identifier: "1",
          metadata:
            '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "QmTChqp83bu9faWsaBjF6Azr4yAzQqws3pUAHyZjfvLzu9", "title": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb", "duration": 135353632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
          createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
          createdAt: 1697302641,
          viewCount: 23,
          like: 12,
          dislike: 4,
        };
        if (!videoInfo) return null;
        const metadata = JSON.parse(videoInfo.metadata);
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
    }
  );
  return { data, isFetching, isLoading };
};
