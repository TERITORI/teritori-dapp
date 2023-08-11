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
        if (!videoInfo) return null;
        const metadata = JSON.parse(videoInfo.metadata);
        return {
          identifier: videoInfo.identifier,
          createdBy: videoInfo.createdBy,
          videoMetaInfo: metadata,
          viewCount: isNaN(videoInfo.viewCount) ? 0 : videoInfo.viewCount,
          viewLastTimestamp: videoInfo.lastView,
        } as VideoInfoWithMeta;
      } catch {
        return null;
      }
    }
  );
  return { data, isFetching, isLoading };
};
