import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { Reaction as ReactionFromContract } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../../hooks/feed/useFetchComments";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { usePrevious } from "../../../hooks/usePrevious";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../../utils/navigation";
import {
  DEFAULT_USERNAME,
  getUpdatedReactions,
} from "../../../utils/social-feed";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { tinyAddress } from "../../../utils/text";
import { AnimationFadeIn } from "../../animations";
import { AnimationFadeInOut } from "../../animations/AnimationFadeInOut";
import { CustomPressable } from "../../buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../buttons/PrimaryButtonOutline";
import { CommentsContainer } from "../../cards/CommentsContainer";
import { AvatarWithFrame } from "../../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { PostResultExtra } from "../NewsFeed/NewsFeed.type";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { TipButton } from "../SocialActions/TipButton";
import { DateTime } from "./DateTime";
import { SocialMessageContent } from "./SocialMessageContent";

export interface SocialCommentCardProps {
  comment: PostResultExtra;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
  onPressReply: OnPressReplyType;
  overrideParentId?: string;
  refresh?: number;
  onScrollTo?: (y: number) => void;
  parentOffsetValue?: number;
}

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({
  style,
  comment,
  isLast,
  onPressReply,
  overrideParentId,
  refresh,
  onScrollTo,
  parentOffsetValue = 0,
}) => {
  const [localComment, setLocalComment] = useState({ ...comment });
  const navigation = useAppNavigation();
  const [replyShown, setReplyShown] = useState(false);
  const [replyListYOffset, setReplyListYOffset] = useState<number[]>([]);
  const [replyListLayout, setReplyListLayout] = useState<LayoutRectangle>();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { data, refetch, fetchNextPage, hasNextPage, isFetching } =
    useFetchComments({
      parentId: localComment.identifier,
      totalCount: localComment.sub_post_length,
      enabled: replyShown,
    });
  const oldIsFetching = usePrevious(isFetching);

  const { mutate: reactToComment, isLoading: isReactLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          localComment.reactions,
          variables.msg.icon
        );
        setLocalComment({
          ...localComment,
          reactions: reactions as ReactionFromContract[],
        });
      },
    });

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );
  const moreCommentsCount = localComment.sub_post_length - comments.length;

  const metadata = JSON.parse(localComment.metadata);
  const authorId = getUserId(selectedNetworkId, localComment.post_by);
  const authorNSInfo = useNSUserInfo(authorId);
  const userInfo = useNSUserInfo(wallet?.userId);
  const username = authorNSInfo?.metadata?.tokenId
    ? tinyAddress(authorNSInfo?.metadata?.tokenId || "", 19)
    : DEFAULT_USERNAME;

  useEffect(() => {
    if (replyShown) {
      refetch();
    }
  }, [comment?.identifier, refresh]);

  useEffect(() => {
    setLocalComment({ ...localComment, isInLocal: comment.isInLocal });
  }, [comment.isInLocal]);

  useEffect(() => {
    if (oldIsFetching === true && !isFetching) {
      onScrollTo &&
        onScrollTo(
          replyListYOffset.reduce((acc, cur) => acc + cur, parentOffsetValue)
        );
    }
  }, [isFetching]);

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

  const handleReaction = async (e: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });

    reactToComment({
      client,
      msg: {
        icon: e,
        identifier: localComment.identifier,
        up: true,
      },
    });
  };

  return (
    <CustomPressable
      disabled={!!localComment.isInLocal}
      onPress={() =>
        navigation.navigate("FeedPostView", { id: localComment.identifier })
      }
    >
      <AnimationFadeIn
        onLayout={(e) =>
          setReplyListYOffset((prev) => {
            prev[0] = e.nativeEvent.layout.y;
            return prev;
          })
        }
      >
        <View style={[styles.container]}>
          <View style={styles.curvedLine} />
          {isLast && <View style={styles.extraLineHider} />}

          {/*========== Card */}
          <View style={[styles.commentContainer, style]}>
            <AnimationFadeInOut
              visible={!!localComment.isInLocal}
              style={styles.loadingOverlay}
            >
              <ActivityIndicator color={primaryColor} />
            </AnimationFadeInOut>

            <View style={styles.commentContainerInside}>
              {/*====== Card Header */}
              <FlexRow>
                {/*---- User image */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserPublicProfile", {
                      id: authorId,
                    })
                  }
                  style={{
                    marginRight: layout.padding_x2,
                  }}
                >
                  <AvatarWithFrame
                    image={authorNSInfo?.metadata?.image}
                    size="M"
                    isLoading={authorNSInfo.loading}
                  />
                </TouchableOpacity>

                {/*---- User name */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserPublicProfile", {
                      id: authorId,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <AnimationFadeIn>
                    <BrandText style={fontSemibold16}>
                      {authorNSInfo?.metadata?.public_name ||
                        localComment.post_by}
                    </BrandText>
                  </AnimationFadeIn>
                </TouchableOpacity>

                {/*---- User TNS name */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserPublicProfile", {
                      id: authorId,
                    })
                  }
                  style={{ marginHorizontal: layout.padding_x1_5 }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: neutral77,
                      },
                    ]}
                  >
                    @
                    {authorNSInfo?.metadata?.tokenId
                      ? tinyAddress(authorNSInfo.metadata.tokenId, 19)
                      : localComment.post_by}
                  </BrandText>
                </TouchableOpacity>

                {/*---- Date */}
                <DateTime date={metadata.createdAt} />
              </FlexRow>
              <SpacerColumn size={2} />

              {/*====== Card Content */}
              <SocialMessageContent
                metadata={metadata}
                type={localComment.category}
              />

              {/*====== Card Actions */}
              <FlexRow justifyContent="flex-end">
                <Reactions
                  reactions={localComment.reactions}
                  onPressReaction={() => {}}
                />
                <SpacerRow size={2.5} />
                <EmojiSelector
                  onEmojiSelected={handleReaction}
                  isLoading={isReactLoading}
                />
                <SpacerRow size={2.5} />
                <ReplyButton onPress={handleReply} />
                <SpacerRow size={2.5} />
                <CommentsCount count={localComment.sub_post_length} />

                {authorNSInfo.metadata?.tokenId !==
                  userInfo?.metadata?.tokenId && (
                  <>
                    <SpacerRow size={2.5} />
                    <TipButton
                      postTokenId={authorNSInfo?.metadata?.tokenId || ""}
                    />
                  </>
                )}

                <SpacerRow size={2.5} />
                <ShareButton postId={localComment.identifier} />
              </FlexRow>
            </View>
          </View>
        </View>

        {comments && (
          <View
            style={styles.subCommentContainer}
            onLayout={(e) =>
              setReplyListYOffset((prev) => {
                prev[2] = e.nativeEvent.layout.height;
                setReplyListLayout(e.nativeEvent.layout);
                return prev;
              })
            }
          >
            {isLast && <View style={[styles.extraLineHider, { left: -61 }]} />}
            <CommentsContainer
              comments={comments}
              onPressReply={onPressReply}
              overrideParentId={localComment.identifier}
            />
          </View>
        )}
      </AnimationFadeIn>

      {isLast && overrideParentId ? null : (
        <AnimationFadeIn
          style={styles.repliesButtonContainer}
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 1,
    position: "relative",
    marginLeft: -1,
  },
  curvedLine: {
    width: 60,
    height: 10,
    marginTop: 70,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 30,
    borderColor: neutral22,
  },
  commentContainer: {
    overflow: "hidden",
    borderRadius: 12,
    marginVertical: 0.5,
    borderColor: neutral33,
    borderWidth: 1,
    flex: 1,
  },
  commentContainerInside: {
    paddingVertical: layout.padding_x2,
    paddingHorizontal: layout.padding_x2_5,
  },
  content: { flex: 1 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  repliesButtonContainer: {
    zIndex: 10,
    position: "absolute",
    bottom: -16,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {},
  actionContainer: {
    borderTopWidth: 1,
    marginTop: layout.padding_x1_5,
    paddingTop: layout.padding_x1_5,
    borderColor: neutral22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  extraLineHider: {
    marginTop: 73,
    width: 1,
    height: "100%",
    backgroundColor: neutral00,
    zIndex: 1000,
    position: "absolute",
    left: 0,
  },
  subCommentContainer: {
    marginLeft: 60,
  },
  loadingOverlay: {
    backgroundColor: withAlpha(secondaryColor, 0.2),
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
