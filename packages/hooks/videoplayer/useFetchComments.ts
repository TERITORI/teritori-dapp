import { useQuery } from "@tanstack/react-query";

import { GetCommentListRequest, CommentInfo } from "../../api/video/v1/video";
import { mustGetVideoClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useFetchComments = (req: GetCommentListRequest) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { data, isFetching, isLoading } = useQuery(
    ["video_comments", selectedNetworkId, { ...req }],
    async () => {
      try {
        return await getComments(selectedNetworkId, req);
      } catch (err) {
        console.error("initData err", err);
        return [];
      }
    },
  );
  return { data, isFetching, isLoading };
};
const getComments = async (networkId: string, req: GetCommentListRequest) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const videoClient = mustGetVideoClient(networkId);
    const response = await videoClient.GetCommentList(req);
    // ---- We sort by creation date
    return response.commentInfos;

    // return [
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    //   {
    //     comment: "comment comment comment comment comment comment comment ",
    //     createdBy: "testori-tori1c4a8e6lc9uuaeqmlsw6gyyxpvun5pjagfs7p5h",
    //     createdAt: 256258,
    //   },
    // ];
  } catch {
    return [] as CommentInfo[];
  }
};
