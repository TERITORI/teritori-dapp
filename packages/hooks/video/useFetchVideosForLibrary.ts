import { useQuery } from "@tanstack/react-query";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { mustGetVideoClient } from "../../utils/backend";
import { VideoMetaInfo, VideoInfoWithMeta } from "../../utils/types/video";
export const useFetchVideosForLibrary = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { data, isFetching, isLoading } = useQuery(
    ["video_list_library", selectedNetworkId, userId],
    async () => {
      try {
        const res = await mustGetVideoClient(
          selectedNetworkId
        ).GetVideoListForLibrary({
          user: userId,
        });
        const videoList = res.videoInfos;
        const videoInfos: VideoInfoWithMeta[] = [];
        videoList.map((videoInfo) => {
          const metadata = JSON.parse(videoInfo.metadata) as VideoMetaInfo;
          videoInfos.push({
            identifier: videoInfo.identifier,
            videoMetaInfo: metadata,
            createdBy: videoInfo.createdBy,
          } as VideoInfoWithMeta);
        });

        return videoInfos;
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  );
  return { data, isFetching, isLoading };
};
