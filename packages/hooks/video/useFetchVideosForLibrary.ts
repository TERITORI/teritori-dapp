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
