import { StyleProp, ViewStyle } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { PostExtra, OnPressReplyType } from "@/utils/types/feed";

export interface SocialCommentCardProps {
  // We use the cardWidth provided from CommentsContainer.
  // The width of the CommentCard depends on its parent's width. The comments are a tree
  cardWidth: number;
  comment: PostExtra;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
  onPressReply: OnPressReplyType;
  overrideParentId?: string;
  onScrollTo?: (y: number) => void;
  parentOffsetValue?: number;
  refetchFeed?: () => Promise<void>;
  CommentsContainer: React.FC<CommentsContainerProps>;
}

export interface CommentsContainerProps
  extends Omit<
    SocialCommentCardProps,
    "comment" | "isLast" | "CommentsContainer"
  > {
  comments: Post[];
}
