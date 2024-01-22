import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { SOCIAl_CARD_BORDER_RADIUS } from "./SocialThreadCard";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../../../hooks/feed/useFetchComments";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { usePrevious } from "../../../../hooks/usePrevious";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../../networks";
import { OnPressReplyType } from "../../../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../../../utils/navigation";
import { DEFAULT_USERNAME } from "../../../../utils/social-feed";
import {
  neutral00,
  neutral22,
  neutral33,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { tinyAddress } from "../../../../utils/text";
import { AnimationFadeIn } from "../../../animations/AnimationFadeIn";
import { AnimationFadeInOut } from "../../../animations/AnimationFadeInOut";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../../buttons/PrimaryButtonOutline";
import {
  CommentsContainer,
  LINES_HORIZONTAL_SPACE,
} from "../../../cards/CommentsContainer";
import { SpacerColumn } from "../../../spacer";
import { PostExtra } from "../../NewsFeed/NewsFeed.type";
import { SocialCardFooter } from "../SocialCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialMessageContent } from "../SocialMessageContent";

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
  refetchFeed?: () => Promise<any>;
}

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({
  style,
  comment,
  isLast,
  onPressReply,
  overrideParentId,
  onScrollTo,
  parentOffsetValue = 0,
  cardWidth,
  refetchFeed,
}) => {
  const [localComment, setLocalComment] = useState<PostExtra>({ ...comment });
  const [viewWidth, setViewWidth] = useState(0);
  const isMobile = useIsMobile();
  const navigation = useAppNavigation();
  const [replyShown, setReplyShown] = useState(false);
  const [replyListYOffset, setReplyListYOffset] = useState<number[]>([]);
  const [replyListLayout, setReplyListLayout] = useState<LayoutRectangle>();
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetwork?.id || "";
  const [, authorAddress] = parseUserId(localComment.authorId);

  const { data, refetch, fetchNextPage, hasNextPage, isFetching } =
    useFetchComments({
      parentId: localComment.identifier,
      totalCount: localComment.subPostLength,
      enabled: replyShown,
    });
  const oldIsFetching = usePrevious(isFetching);

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data],
  );
  const moreCommentsCount = localComment.subPostLength - comments.length;
  const authorNSInfo = useNSUserInfo(localComment.authorId);
  const username = authorNSInfo?.metadata?.tokenId
    ? tinyAddress(authorNSInfo?.metadata?.tokenId || "", 19)
    : DEFAULT_USERNAME;

  useEffect(() => {
    if (replyShown) {
      refetch();
    }
  }, [replyShown, refetch]);

  useEffect(() => {
    setLocalComment((localComment) => {
      return { ...localComment, isInLocal: comment.isInLocal };
    });
  }, [comment.isInLocal]);

  useEffect(() => {
    if (oldIsFetching === true && !isFetching) {
      onScrollTo &&
        onScrollTo(
          replyListYOffset.reduce((acc, cur) => acc + cur, parentOffsetValue),
        );
    }
  }, [
    isFetching,
    oldIsFetching,
    onScrollTo,
    parentOffsetValue,
    replyListYOffset,
  ]);

  const onShowReply = () => {
    if (replyShown) {
      if (hasNextPage) {
        fetchNextPage();
      }
    } else {
      setReplyShown(true);
    }
  };

  const handleReply = () =>
    onPressReply?.({
      username,
      parentId: overrideParentId || localComment.identifier,
      yOffsetValue:
        parentOffsetValue + (replyListLayout ? replyListLayout.y : 0),
    });

  return (
    <CustomPressable
      onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
      disabled={!!localComment.isInLocal}
      onPress={() =>
        navigation.navigate("FeedPostView", {
          id: getNetworkObjectId(selectedNetworkId, localComment.identifier),
        })
      }
      style={{ width: cardWidth }}
    >
      <AnimationFadeIn
        onLayout={(e) =>
          setReplyListYOffset((prev) => {
            prev[0] = e.nativeEvent.layout.y;
            return prev;
          })
        }
      >
        <View style={containerCStyle}>
          {!isMobile ? (
            <View
              style={[curvedLineCStyle, { width: LINES_HORIZONTAL_SPACE }]}
            />
          ) : null}
          {isLast && !isMobile ? <View style={extraLineHiderCStyle} /> : null}

          {/*========== Card */}
          <View style={[commentContainerCStyle, style]}>
            <AnimationFadeInOut
              visible={!!localComment.isInLocal}
              style={loadingOverlayCStyle}
            >
              <ActivityIndicator color={primaryColor} />
            </AnimationFadeInOut>

            <View style={commentContainerInsideCStyle}>
              {/*====== Card Header */}
              <SocialCardHeader
                authorAddress={authorAddress}
                authorId={localComment.authorId}
                createdAt={localComment.createdAt}
                authorMetadata={authorNSInfo?.metadata}
              />

              <SpacerColumn size={1.5} />

              {/*====== Card Content */}
              <SocialMessageContent post={localComment} />
              <SpacerColumn size={1.5} />

              {/*====== Card Actions */}
              <SocialCardFooter
                cardWidth={viewWidth}
                isPostConsultation
                post={localComment}
                handleReply={handleReply}
                refetchFeed={refetchFeed}
                setPost={setLocalComment}
              />
            </View>
          </View>
        </View>

        {comments && (
          <View
            style={{ marginLeft: isMobile ? 0 : LINES_HORIZONTAL_SPACE }}
            onLayout={(e) =>
              setReplyListYOffset((prev) => {
                prev[2] = e.nativeEvent.layout.height;
                setReplyListLayout(e.nativeEvent.layout);
                return prev;
              })
            }
          >
            {isLast && !isMobile ? (
              <View style={[extraLineHiderCStyle, { left: -61 }]} />
            ) : null}
            <CommentsContainer
              cardWidth={
                isMobile
                  ? cardWidth
                  : cardWidth - LINES_HORIZONTAL_SPACE * 2 - 1 // If not -1, the borderRight is hidden on small screens
              }
              refetchFeed={refetchFeed}
              comments={comments}
              onPressReply={onPressReply}
              overrideParentId={localComment.identifier}
            />
          </View>
        )}
      </AnimationFadeIn>

      {isLast && overrideParentId ? null : (
        <AnimationFadeIn
          style={repliesButtonContainerCStyle}
          onLayout={(e) =>
            setReplyListYOffset((prev) => {
              prev[1] = e.nativeEvent.layout.y;
              return prev;
            })
          }
        >
          {moreCommentsCount > 0 && (
            <PrimaryButtonOutline
              size="XS"
              text={`Show Replies (${moreCommentsCount})`}
              onPress={onShowReply}
              isLoading={isFetching}
              width={200}
            />
          )}
        </AnimationFadeIn>
      )}
    </CustomPressable>
  );
};

const containerCStyle: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "flex-start",
  zIndex: 1,
  position: "relative",
  marginLeft: -1,
};
const curvedLineCStyle: ViewStyle = {
  height: 10,
  marginTop: 70,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderBottomLeftRadius: 30,
  borderColor: neutral22,
};
const commentContainerCStyle: ViewStyle = {
  overflow: "hidden",
  borderRadius: SOCIAl_CARD_BORDER_RADIUS,
  marginVertical: 0.5,
  borderColor: neutral33,
  borderWidth: 1,
  flex: 1,
};
const commentContainerInsideCStyle: ViewStyle = {
  paddingVertical: layout.spacing_x2,
  paddingHorizontal: layout.spacing_x2_5,
};
const repliesButtonContainerCStyle: ViewStyle = {
  zIndex: 10,
  position: "absolute",
  bottom: -21,
  right: 0,
  left: 0,
  alignItems: "center",
  justifyContent: "center",
};
const extraLineHiderCStyle: ViewStyle = {
  marginTop: 73,
  width: 1,
  height: "100%",
  backgroundColor: neutral00,
  zIndex: 1000,
  position: "absolute",
  left: 0,
};
const loadingOverlayCStyle: ViewStyle = {
  backgroundColor: withAlpha(secondaryColor, 0.2),
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
