import { useQuery } from "@tanstack/react-query";

import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { VideoMetaInfo, VideoInfoWithMeta } from "../../utils/types/video";
import { useSelectedNetworkId } from "../useSelectedNetwork";
export const useFetchVideosForLibrary = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { data, isFetching, isLoading } = useQuery(
    ["video_list_library", selectedNetworkId, userId],
    async () => {
      try {
        // const res = await mustGetVideoClient(
        //   selectedNetworkId
        // ).GetVideoListForLibrary({
        //   user: userId,
        // });
        // const videoList = res.videoInfos;
        const videoList = [
          {
            identifier: "1",
            metadata:
              '{"url": "QmQqjkE5jBK3T7vQiBun8YCG41dooxgvXCYbzF1sBJRQs1", "image": "QmTChqp83bu9faWsaBjF6Azr4yAzQqws3pUAHyZjfvLzu9", "title": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb", "duration": 135353632, "description": "sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb sfdsdg dg bh d bdbsdb"}',
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

        return videoInfos;
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  );
  return { data, isFetching, isLoading };
};
