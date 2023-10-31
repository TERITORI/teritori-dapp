import { useQueryClient } from "@tanstack/react-query";

import { FetchCommentResponse } from "./useFetchComments";
import { PostResultExtra } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTeritoriSocialFeedCreatePostMutation } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import useSelectedWallet from "../useSelectedWallet";

// =============== Used only for Simple Post for now. (Sorry for the mess)
export const useCreatePost = ({
  onSuccess,
  onMutate,
}: {
  onSuccess?: () => void;
  onMutate?: () => void;
}) => {
  const wallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const queryClient = useQueryClient();

  const request = useTeritoriSocialFeedCreatePostMutation({
    onMutate: (data) => {
      const newComment: PostResultExtra = {
        category: data.msg.category,
        deleted: false,
        identifier: data.msg.identifier,
        metadata: data.msg.metadata,
        parent_post_identifier: data.msg.parentPostIdentifier,
        post_by: wallet?.address || "",
        sub_post_length: 0,
        isInLocal: true,
        reactions: [],
        user_reactions: [],
        tip_amount: "0",
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
      const updatedComment = context.newComment as PostResultExtra;
      delete updatedComment.isInLocal;

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
    newComment: PostResultExtra,
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
