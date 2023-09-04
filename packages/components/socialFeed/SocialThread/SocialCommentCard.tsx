import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { SocialCardHeader } from "./SocialCardHeader";
import { SocialMessageContent } from "./SocialMessageContent";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { Reaction as ReactionFromContract } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../../hooks/feed/useFetchComments";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { usePrevious } from "../../../hooks/usePrevious";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getNetworkObjectId,
  mustGetGnoNetwork,
  NetworkKind,
  parseUserId,
} from "../../../networks";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { adenaDoContract } from "../../../utils/gno";
import { useAppNavigation } from "../../../utils/navigation";
import {
  DEFAULT_USERNAME,
  getUpdatedReactions,
} from "../../../utils/social-feed";
import {
  neutral00,
  neutral22,
  neutral33,
  primaryColor,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import FlexRow from "../../FlexRow";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { AnimationFadeInOut } from "../../animations/AnimationFadeInOut";
import { CustomPressable } from "../../buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../buttons/PrimaryButtonOutline";
import {
  CommentsContainer,
  LINES_HORIZONTAL_SPACE,
} from "../../cards/CommentsContainer";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { PostExtra } from "../NewsFeed/NewsFeed.type";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { FlagButton } from "../SocialActions/FlagButton";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { TipButton } from "../SocialActions/TipButton";
import { TERITORI_FEED_ID } from "../const";

const BREAKPOINT_S = 480;

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
  const wallet = useSelectedWallet();
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

  const { mutate: postMutate, isLoading: isPostMutationLoading } =
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
  const moreCommentsCount = localComment.subPostLength - comments.length;
  const metadata = JSON.parse(localComment.metadata);
  const authorNSInfo = useNSUserInfo(localComment.authorId);
  const userInfo = useNSUserInfo(wallet?.userId);
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
          replyListYOffset.reduce((acc, cur) => acc + cur, parentOffsetValue)
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

  const cosmosReaction = async (icon: string, walletAddress: string) => {
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId,
      walletAddress,
    });

    postMutate({
      client,
      msg: {
        icon,
        identifier: localComment.identifier,
        up: true,
      },
    });
  };

  const gnoReaction = async (icon: string, rpcEndpoint: string) => {
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);

    const vmCall = {
      caller: wallet?.address || "",
      send: "",
      pkg_path: gnoNetwork.socialFeedsPkgPath,
      func: "ReactPost",
      args: [TERITORI_FEED_ID, localComment.identifier, icon, "true"],
    };

    const txHash = await adenaDoContract(
      selectedNetworkId || "",
      [{ type: "/vm.m_call", value: vmCall }],
      {
        gasWanted: 2_000_000,
      }
    );

    const provider = new GnoJSONRPCProvider(rpcEndpoint);

    // Wait for tx done
    await provider.waitForTransaction(txHash);

    const reactions = getUpdatedReactions(localComment.reactions, icon);
    setLocalComment({
      ...localComment,
      reactions: reactions as ReactionFromContract[],
    });
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

    if (selectedNetwork?.kind === NetworkKind.Gno) {
      gnoReaction(e, selectedNetwork.endpoint);
    } else {
      cosmosReaction(e, wallet.address);
    }
  };

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
        <View style={styles.container}>
          {!isMobile ? (
            <View
              style={[styles.curvedLine, { width: LINES_HORIZONTAL_SPACE }]}
            />
          ) : null}
          {isLast && !isMobile ? <View style={styles.extraLineHider} /> : null}

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
              <SocialCardHeader
                authorAddress={authorAddress}
                authorId={localComment.authorId}
                postMetadata={metadata}
                authorMetadata={authorNSInfo?.metadata}
              />

              <SpacerColumn size={2} />

              {/*====== Card Content */}
              <SocialMessageContent
                metadata={metadata}
                postCategory={localComment.category}
                authorId={localComment.authorId}
                postId={localComment.identifier}
              />

              <SpacerColumn size={2} />

              {/*====== Card Actions */}
              <FlexRow
                justifyContent="flex-end"
                style={
                  viewWidth < BREAKPOINT_S && {
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }
                }
              >
                <Reactions
                  nbShown={nbReactionsShown(viewWidth)}
                  reactions={localComment.reactions}
                  onPressReaction={handleReaction}
                  isLoading={isPostMutationLoading}
                />

                {viewWidth < BREAKPOINT_S && localComment.reactions.length ? (
                  <SpacerColumn size={2} />
                ) : (
                  <SpacerRow size={2.5} />
                )}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <EmojiSelector
                    onEmojiSelected={handleReaction}
                    isLoading={isPostMutationLoading}
                  />
                  <SpacerRow size={2.5} />
                  <ReplyButton onPress={handleReply} />
                  <SpacerRow size={2.5} />
                  <CommentsCount count={localComment.subPostLength} />

                  <SpacerRow size={2.5} />
                  <TipButton
                    disabled={
                      authorNSInfo?.metadata?.tokenId ===
                      userInfo?.metadata?.tokenId
                    }
                    amount={localComment.tipAmount}
                    author={username}
                    postId={localComment.identifier}
                  />

                  <SpacerRow size={2.5} />

                  {selectedNetwork?.kind === NetworkKind.Gno && (
                    <FlagButton
                      refetchFeed={refetchFeed}
                      postId={localComment.identifier}
                    />
                  )}

                  <SpacerRow size={2.5} />

                  <ShareButton postId={localComment.identifier} />
                </View>
              </FlexRow>
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
              <View style={[styles.extraLineHider, { left: -61 }]} />
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
    paddingVertical: layout.spacing_x2,
    paddingHorizontal: layout.spacing_x2_5,
  },
  content: { flex: 1 },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  repliesButtonContainer: {
    zIndex: 10,
    position: "absolute",
    bottom: -21,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContainer: {
    borderTopWidth: 1,
    marginTop: layout.spacing_x1_5,
    paddingTop: layout.spacing_x1_5,
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
