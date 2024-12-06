import { ResizeMode } from "expo-av";
import React, { FC, Fragment, useEffect, useState } from "react";
import { TextInput, useWindowDimensions, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { VideoComment } from "./VideoComment";

import { Post, PostsRequest } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { MediaPlayerVideo } from "@/components/mediaPlayer/MediaPlayerVideo";
import { DislikeButton } from "@/components/socialFeed/SocialActions/DislikeButton";
import { LikeButton } from "@/components/socialFeed/SocialActions/LikeButton";
import { ReportButton } from "@/components/socialFeed/SocialActions/ReportButton";
import { ShareButton } from "@/components/socialFeed/SocialActions/ShareButton";
import { TipButton } from "@/components/socialFeed/SocialActions/TipButton";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { VideosList } from "@/components/video/VideosList";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useFeedPosting } from "@/hooks/feed/useFeedPosting";
import { useFetchComments } from "@/hooks/feed/useFetchComments";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetwork, NetworkKind, parseUserId } from "@/networks";
import { generatePostMetadata } from "@/utils/feed/queries";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  DEFAULT_USERNAME,
  hashtagMatch,
  mentionMatch,
  SOCIAl_CARD_BORDER_RADIUS,
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
} from "@/utils/social-feed";
import { neutral77, neutralA3, secondaryColor } from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "@/utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  SOCIAL_FEED_BREAKPOINT_M,
} from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import {
  PostCategory,
  ReplyToType,
  ZodSocialFeedVideoMetadata,
} from "@/utils/types/feed";

const POST_VIDEO_MAX_WIDTH = 960;
const INPUT_MIN_HEIGHT = 20;
const INPUT_MAX_HEIGHT = 400;

export const FeedPostVideoView: FC<{
  post: Post;
  refetchPost: () => Promise<any>;
}> = ({ post, refetchPost }) => {
  const network = getNetwork(post.networkId);
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();

  const [viewWidth, setViewWidth] = useState(0);
  const isMobile = useIsMobile();

  const [localPost, setLocalPost] = useState(post || Post.create());
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, localPost.metadata);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const username =
    authorNSInfo?.metadata?.tokenId ||
    tinyAddress(authorAddress) ||
    DEFAULT_USERNAME;

  const {
    data: comments,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useFetchComments({
    parentId: localPost.id,
    totalCount: localPost.subPostLength,
    enabled: true,
  });
  const isNextPageAvailable = useSharedValue(hasNextPage);
  const inputHeight = useSharedValue(INPUT_MIN_HEIGHT);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const isGoingUp = useSharedValue(false);
  const aref = useAnimatedRef<Animated.ScrollView>();

  const { setToastError } = useFeedbacks();
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const [newComment, setNewComment] = useState("");
  const [isCreateCommentLoading, setCreateCommentLoading] = useState(false);

  const { makePost, isProcessing } = useFeedPosting(
    post.networkId,
    wallet?.userId,
    PostCategory.Comment,
    () => {
      setNewComment("");
      setReplyTo(undefined);
      refetch();
    },
  );

  const allVideosFeedRequest: Partial<PostsRequest> = {
    filter: {
      networkId: post.networkId,
      categories: [PostCategory.Video],
      user: "",
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
    },
    limit: 10,
    offset: 0,
  };
  const userVideosFeedRequest: Partial<PostsRequest> = {
    filter: {
      networkId: post.networkId,
      categories: [PostCategory.Video],
      user: localPost.authorId,
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
    },
    limit: 10,
    offset: 0,
  };
  const [otherVideosRequest, setOtherVideosRequest] = useState(
    userVideosFeedRequest,
  );
  const onFetchOtherVideosSuccess = (nbResults: number) => {
    if (!nbResults) setOtherVideosRequest(allVideosFeedRequest);
  };

  const handleNewCommentTextChange = (text: string) => {
    // Comments are blocked at 2500
    if (text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) return;
    setNewComment(text);
  };

  const handleSubmitComment = async () => {
    setCreateCommentLoading(true);
    try {
      const hasUsername =
        replyTo?.parentId && newComment.includes(`@${replyTo.username}`);
      // ---- Adding hashtag texts or mentioned texts to the metadata
      const mentions: string[] = [];
      mentionMatch(newComment)?.map((item) => {
        //TODO: Check NS token id before sending mentioned text ?

        mentions.push(item);
      });
      const hashtags: string[] = [];
      hashtagMatch(newComment)?.map((item) => {
        hashtags.push(item);
      });
      // ---- Adding hashtag or mentioned user at the end of the message and to the metadata
      const finalMessage = newComment || "";

      const metadata = generatePostMetadata({
        title: "",
        message: finalMessage,
        files: [],
        hashtags,
        mentions,
        gifs: [],
        premium: false,
      });

      await makePost(
        JSON.stringify(metadata),
        hasUsername ? replyTo?.parentId : localPost.id,
      );
    } catch (err) {
      console.error("post submit err", err);
      setToastError({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
    setCreateCommentLoading(false);
  };

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        let offsetPadding = 40;
        offsetPadding += event.layoutMeasurement.height;
        if (
          event.contentOffset.y >= event.contentSize.height - offsetPadding &&
          isNextPageAvailable.value
        ) {
          fetchNextPage();
        }

        if (flatListContentOffsetY > event.contentOffset.y) {
          isGoingUp.value = true;
        } else if (flatListContentOffsetY < event.contentOffset.y) {
          isGoingUp.value = false;
        }
        runOnJS(setFlatListContentOffsetY)(event.contentOffset.y);
      },
    },
    [post.id],
  );

  useEffect(() => {
    if (!post) return;
    setLocalPost(post);
  }, [post]);

  useEffect(() => {
    // HECK: updated state was not showing up in scrollhander
    isNextPageAvailable.value = hasNextPage;
  }, [hasNextPage, isNextPageAvailable]);

  if (!video) return <BrandText>Video not valid</BrandText>;
  return (
    <ScreenContainer
      headerChildren={<ScreenTitle>Video by {username}</ScreenTitle>}
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Feed")
      }
      isLarge
      responsive
    >
      <Animated.ScrollView
        ref={aref}
        contentContainerStyle={{
          width: "100%",
          alignSelf: "center",
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      >
        <View
          style={{
            paddingTop: layout.spacing_x2_5,
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "flex-start" : "center",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 1,
              maxWidth: POST_VIDEO_MAX_WIDTH,
            }}
          >
            <View
              onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
              style={{
                width: "100%",
              }}
            >
              {/*====== Video player ======*/}
              <MediaPlayerVideo
                videoMetadata={video}
                style={{
                  aspectRatio: 1.7,
                  width: viewWidth - 2,
                  borderRadius: SOCIAl_CARD_BORDER_RADIUS,
                }}
                resizeMode={ResizeMode.CONTAIN}
                postId={localPost.id}
              />

              {/*====== Video info ======*/}
              <SpacerColumn size={1.5} />
              <View>
                <BrandText
                  numberOfLines={2}
                  style={
                    viewWidth < SOCIAL_FEED_BREAKPOINT_M
                      ? fontSemibold16
                      : fontSemibold20
                  }
                >
                  {video.title?.trim()}
                </BrandText>

                <SpacerColumn size={1.5} />
                <View
                  style={[
                    viewWidth >= SOCIAL_FEED_BREAKPOINT_M && {
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <SocialCardHeader
                    authorId={localPost.authorId}
                    createdAt={localPost.createdAt}
                    postWithLocationId={video?.location && localPost.id}
                  />
                  {viewWidth < SOCIAL_FEED_BREAKPOINT_M && (
                    <SpacerColumn size={1} />
                  )}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <LikeButton post={localPost} setPost={setLocalPost} />
                    <SpacerRow size={1.5} />
                    <DislikeButton post={localPost} setPost={setLocalPost} />

                    <SpacerRow size={1.5} />
                    <TipButton
                      disabled={localPost.authorId === wallet?.userId}
                      amount={localPost.tipAmount}
                      authorId={localPost.authorId}
                      postId={localPost.id}
                      useAltStyle
                    />

                    <SpacerRow size={1.5} />
                    <ShareButton postId={localPost.id} useAltStyle />

                    {network?.kind === NetworkKind.Gno && (
                      <>
                        <SpacerRow size={1.5} />
                        <ReportButton
                          refetchFeed={refetchPost}
                          postId={localPost.id}
                          useAltStyle
                        />
                      </>
                    )}
                  </View>
                </View>

                {video.description && (
                  <>
                    <SpacerColumn size={1.5} />
                    <BrandText
                      style={[fontSemibold14, { color: neutralA3 }]}
                      numberOfLines={
                        viewWidth < SOCIAL_FEED_BREAKPOINT_M ? 2 : 3
                      }
                    >
                      {video.description?.trim()}
                    </BrandText>
                  </>
                )}
              </View>
            </View>

            {/*====== Comment input ======*/}
            <SpacerColumn size={3} />
            <BrandText style={fontSemibold16}>
              {comments.length} comments
            </BrandText>
            <SpacerColumn size={1.5} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <UserAvatarWithFrame
                userId={wallet?.userId}
                size={windowWidth < RESPONSIVE_BREAKPOINT_S ? "XS" : "S"}
              />
              <SpacerRow size={2} />
              <View style={{ flex: 1 }}>
                <TextInput
                  value={newComment}
                  placeholder="Leave your comment here"
                  placeholderTextColor={neutral77}
                  onChangeText={handleNewCommentTextChange}
                  multiline
                  onContentSizeChange={(e) => {
                    // TODO: onContentSizeChange is not fired when deleting lines. We can only grow the input, but not shrink
                    if (e.nativeEvent.contentSize.height < INPUT_MAX_HEIGHT) {
                      inputHeight.value = e.nativeEvent.contentSize.height;
                    }
                  }}
                  style={[
                    fontSemibold14,
                    {
                      height: newComment
                        ? inputHeight.value || INPUT_MIN_HEIGHT
                        : INPUT_MIN_HEIGHT,
                      width: "100%",
                      color: secondaryColor,
                    },
                  ]}
                />
                <SpacerColumn size={0.5} />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: neutral77,
                  }}
                />
              </View>
              <SpacerRow size={2} />
              <PrimaryButton
                size="M"
                text="Comment"
                disabled={!newComment || !wallet}
                isLoading={isCreateCommentLoading || isProcessing}
                onPress={handleSubmitComment}
              />
            </View>

            {/*====== Comments list ======*/}
            {comments.map((comment, index) => (
              <Fragment key={index}>
                <SpacerColumn size={2.5} />
                <VideoComment comment={comment} />
              </Fragment>
            ))}

            {/*====== Other videos (mobile) ======*/}
            {isMobile && (
              <VideosList
                consultedPostId={localPost.id}
                title={
                  otherVideosRequest.filter?.user
                    ? `More videos from ${username}`
                    : "More videos from Social Feed"
                }
                style={{ width: "100%", marginTop: layout.spacing_x3 }}
                onFetchFeedSuccess={onFetchOtherVideosSuccess}
                req={otherVideosRequest}
              />
            )}
          </View>

          {/*====== Other videos (desktop) ======*/}
          {!isMobile && (
            <VideosList
              consultedPostId={localPost.id}
              title={
                otherVideosRequest.filter?.user
                  ? `More videos from ${username}`
                  : "More videos from Social Feed"
              }
              style={{
                width: "100%",
                maxWidth: 308,
                marginLeft: layout.spacing_x3,
              }}
              onFetchFeedSuccess={onFetchOtherVideosSuccess}
              req={otherVideosRequest}
            />
          )}
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
};
