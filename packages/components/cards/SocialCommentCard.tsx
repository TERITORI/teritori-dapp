import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/useFetchComments";
import { usePrevious } from "../../hooks/usePrevious";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { socialFeedBreakpointXL } from "../../screens/Feed/FeedScreen";
import { OnPressReplyType } from "../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../utils/navigation";
import {
  DEFAULT_NAME,
  DEFAULT_USERNAME,
  getUpdatedReactions,
} from "../../utils/social-feed";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { replaceTextWithComponent } from "../../utils/text";
import { BrandText } from "../BrandText";
import { FilePreview } from "../FilePreview/FilePreview";
import { tinyAddress } from "../WalletSelector";
import { AnimationFadeIn } from "../animations";
import { AnimationFadeInOut } from "../animations/AnimationFadeInOut";
import { PrimaryButtonOutline } from "../buttons/PrimaryButtonOutline";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { PostResultExtra } from "../socialFeed/NewsFeed/NewsFeed.type";
import { SocialReactionActions } from "../socialFeed/SocialReactionActions/SocialReactionActions";
import { SpacerColumn, SpacerRow } from "../spacer";
import { CommentsContainer } from "./CommentsContainer";

export interface SocialCommentCardProps {
  comment: PostResultExtra;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
  onPressReply?: OnPressReplyType;
  overrideParentId?: string;
  refresh?: number;
  isFirst?: boolean;
  onScrollTo?: (y: number) => void;
  parentOffsetValue?: number;
}

const MARGIN_HEIGHT = 56;

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({
  style,
  comment,
  isLast,
  onPressReply,
  overrideParentId,
  refresh,
  isFirst,
  onScrollTo,
  parentOffsetValue = 0,
}) => {
  const imageMarginRight = layout.padding_x3_5;
  const { width: windowWidth } = useWindowDimensions();
  const [localComment, setLocalComment] = useState({ ...comment });
  const navigation = useAppNavigation();
  const [replyShown, setReplyShown] = useState(false);
  const [replyListYOffset, setReplyListYOffset] = useState<number[]>([]);
  const [replyListLayout, setReplyListLayout] = useState<LayoutRectangle>();
  const wallet = useSelectedWallet();
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
        const reactions = getUpdatedReactions(localComment, variables.msg.icon);

        setLocalComment({ ...localComment, reactions });
      },
    });

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );
  const moreCommentsCount = localComment.sub_post_length - comments.length;

  const metadata = JSON.parse(localComment.metadata);
  const postByTNSMetadata = useTNSMetadata(localComment?.post_by);
  const currentUserMetadata = useTNSMetadata(wallet?.address);
  const username = postByTNSMetadata?.metadata?.tokenId
    ? tinyAddress(postByTNSMetadata?.metadata?.tokenId || "", 19)
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
    <AnimationFadeIn
      onLayout={(e) =>
        setReplyListYOffset((prev) => {
          prev[0] = e.nativeEvent.layout.y;
          return prev;
        })
      }
    >
      <View style={[styles.container, isFirst && { marginTop: MARGIN_HEIGHT }]}>
        <View style={styles.curvedLine} />
        {isLast && <View style={styles.extraLineHider} />}

        <View style={[styles.commentContainer, style]}>
          <AnimationFadeInOut
            visible={!!localComment.isInLocal}
            style={styles.loadingOverlay}
          >
            <ActivityIndicator color={primaryColor} />
          </AnimationFadeInOut>

          <View style={styles.commentContainerInside}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserPublicProfile", {
                  id: `tori-${localComment.post_by}`,
                })
              }
              style={{
                marginRight: imageMarginRight,
              }}
            >
              <AvatarWithFrame
                isLoading={postByTNSMetadata?.loading}
                image={postByTNSMetadata?.metadata?.image}
                size={windowWidth < socialFeedBreakpointXL ? "M" : "L"}
              />
            </TouchableOpacity>
            <View style={styles.content}>
              <View style={styles.detailsContainer}>
                <View style={styles.rowCenter}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("PublicProfile", {
                        id: `tori-${localComment.post_by}`,
                      })
                    }
                  >
                    <BrandText style={fontSemibold16}>
                      {postByTNSMetadata?.metadata?.public_name || DEFAULT_NAME}
                    </BrandText>
                  </Pressable>
                  <SpacerRow size={1.5} />
                  <Pressable
                    onPress={() =>
                      navigation.navigate("PublicProfile", {
                        id: `tori-${localComment.post_by}`,
                      })
                    }
                  >
                    <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                      @
                      {postByTNSMetadata?.metadata?.tokenId
                        ? tinyAddress(
                            postByTNSMetadata?.metadata?.tokenId || "",
                            19
                          )
                        : DEFAULT_USERNAME}
                    </BrandText>
                  </Pressable>

                  <BrandText
                    style={[
                      fontSemibold12,
                      {
                        marginLeft: layout.padding_x1_5,
                      },
                    ]}
                  >
                    {moment(metadata.createdAt).local().fromNow()}
                  </BrandText>
                </View>

                <SpacerColumn size={1} />
                <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                  {replaceTextWithComponent(
                    metadata.message,
                    /(@[\w&.-]+)/,
                    ({ match }) => (
                      <Pressable
                        onPress={() =>
                          navigation.navigate("PublicProfile", {
                            id: match.replace("@", ""),
                          })
                        }
                      >
                        <BrandText
                          style={[fontSemibold13, { color: primaryColor }]}
                        >
                          {match}
                        </BrandText>
                      </Pressable>
                    )
                  )}
                </BrandText>
                {!!metadata.fileURL && (
                  <FilePreview fileURL={metadata.fileURL} />
                )}
              </View>

              <View style={styles.actionContainer}>
                <BrandText style={[fontMedium13, { color: neutral77 }]}>
                  {localComment.post_by}
                </BrandText>
                <SocialReactionActions
                  isTippable={
                    postByTNSMetadata.metadata?.tokenId !==
                    currentUserMetadata?.metadata?.tokenId
                  }
                  reactions={localComment.reactions}
                  isComment
                  onPressReply={handleReply}
                  showEmojiSelector
                  onPressReaction={handleReaction}
                  isReactionLoading={isReactLoading}
                  postId={comment.identifier}
                />
              </View>
            </View>
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

      {isLast && overrideParentId ? null : (
        <AnimationFadeIn
          style={styles.footer}
          onLayout={(e) =>
            setReplyListYOffset((prev) => {
              prev[1] = e.nativeEvent.layout.y;
              return prev;
            })
          }
        >
          {moreCommentsCount > 0 && (
            <PrimaryButtonOutline
              size="SM"
              text={`View Replies (${moreCommentsCount})`}
              onPress={onShowReply}
              isLoading={isFetching}
              width={200}
            />
          )}
        </AnimationFadeIn>
      )}
    </AnimationFadeIn>
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
    paddingVertical: layout.padding_x3,
    paddingHorizontal: layout.padding_x3,
    flex: 1,
    flexDirection: "row",
  },
  content: { flex: 1 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: MARGIN_HEIGHT,
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
