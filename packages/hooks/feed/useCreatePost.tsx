import { useQueryClient } from "@tanstack/react-query";

import { FetchCommentResponse } from "./useFetchComments";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useTeritoriSocialFeedCreatePostMutation } from "@/contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { getNetworkObjectId, getUserId } from "@/networks";

// =============== Used only for Simple Post for now. (Sorry for the mess)
export const useCreatePost = ({
  onSuccess,
  onMutate,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
}) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const queryClient = useQueryClient();

  const request = useTeritoriSocialFeedCreatePostMutation({
    onMutate: (data) => {
      const localIdentifier = data.msg.identifier || "";
      const newComment: Post = {
        category: data.msg.category,
        isDeleted: false,
        networkId: selectedNetworkId,
        identifier: localIdentifier,
        localIdentifier,
        id: getNetworkObjectId(selectedNetworkId, localIdentifier),
        metadata: data.msg.metadata,
        parentPostIdentifier: data.msg.parentPostIdentifier || "",
        subPostLength: 0,
        authorId: getUserId(selectedNetworkId, wallet?.address || ""),
        reactions: [],
        tipAmount: 0,
        premiumLevel: 0,
        createdAt: Date.now(),
      };

      const prevData = addUpdateNewComment(
        data?.msg?.parentPostIdentifier || "",
        newComment,
        "add",
      );
      onMutate && onMutate();
      // Return a context with the previous user and updated user
      return { prevData, newComment }; // context
    },
    onSuccess: async (_, data, context: any) => {
      const updatedComment = context.newComment as Post;

      addUpdateNewComment(
        data?.msg?.parentPostIdentifier || "",
        updatedComment,
        "update",
      );

      setToastSuccess({
        title: "Post submitted successfully.",
        message: "",
      });

      onSuccess && onSuccess();
    },
    onError: (err, formData, context: any) => {
      queryClient.setQueryData(
        ["FetchComment", wallet?.address, formData.msg.parentPostIdentifier],
        context.prevData,
      );

      setToastError({
        title: "Something went wrong.",
        message: err.message,
      });
      console.error("post submit error", err);
    },
  });

  const addUpdateNewComment = (
    parentPostIdentifier: string,
    newComment: Post,
    type: "add" | "update" = "add",
  ) => {
    const prevData: { pages: FetchCommentResponse[] } =
      queryClient.getQueryData([
        "FetchComment",
        wallet?.address,
        parentPostIdentifier,
      ]) || { pages: [] };

    let commentData = { ...prevData };

    let list = [...(commentData.pages[0]?.list || [])];
    if (type === "update") {
      list.shift();
    }
    list = [newComment, ...list];

    if (commentData.pages?.length) {
      const pages = [...commentData.pages];
      pages.shift();
      commentData = {
        pages: [{ list }, ...pages],
      };
    } else {
      commentData = {
        pages: [
          {
            list,
          },
        ],
      };
    }

    queryClient.setQueryData(
      ["FetchComment", wallet?.address, parentPostIdentifier],
      commentData,
    );

    return prevData;
  };

  return request;
};
