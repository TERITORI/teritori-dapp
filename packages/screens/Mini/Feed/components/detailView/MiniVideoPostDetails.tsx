import { ResizeMode } from "expo-av";
import React, { Fragment, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CustomAppBar from "../../../components/AppBar/CustomAppBar";

import { Post, PostsRequest } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MediaPlayerVideo } from "@/components/mediaPlayer/MediaPlayerVideo";
import { DislikeButton } from "@/components/socialFeed/SocialActions/DislikeButton";
import { LikeButton } from "@/components/socialFeed/SocialActions/LikeButton";
import { ReportButton } from "@/components/socialFeed/SocialActions/ReportButton";
import { ShareButton } from "@/components/socialFeed/SocialActions/ShareButton";
import { TipButton } from "@/components/socialFeed/SocialActions/TipButton";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { VideosList } from "@/components/video/VideosList";
import { useFetchComments } from "@/hooks/feed/useFetchComments";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetwork, NetworkKind, parseUserId } from "@/networks";
import { VideoComment } from "@/screens/FeedPostView/components/VideoComment";
import {
  MiniCommentInput,
  MiniCommentInputInputHandle,
} from "@/screens/Mini/components/MiniCommentInput";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  DEFAULT_USERNAME,
  SOCIAl_CARD_BORDER_RADIUS,
} from "@/utils/social-feed";
import { neutral00, neutralA3 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import {
  PostCategory,
  ReplyToType,
  ZodSocialFeedVideoMetadata,
} from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchPost: () => Promise<any>;
};

export const MiniVideoPostDetails = ({ post, refetchPost }: Props) => {
  const feedInputRef = useRef<MiniCommentInputInputHandle>(null);

  const { width: windowWidth } = useWindowDimensions();
  const wallet = useSelectedWallet();
  const network = getNetwork(post.networkId);
  const [replyTo, setReplyTo] = useState<ReplyToType>();

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
    hasNextPage,
    fetchNextPage,
    refetch: refetchComments,
  } = useFetchComments({
    parentId: localPost.id,
    totalCount: localPost.subPostLength,
    enabled: true,
  });

  const userVideosFeedRequest: Partial<PostsRequest> = {
    filter: {
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

  const allVideosFeedRequest: Partial<PostsRequest> = {
    filter: {
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

  const [otherVideosRequest, setOtherVideosRequest] = useState(
    userVideosFeedRequest,
  );

  const aref = useAnimatedRef<Animated.ScrollView>();
  const isNextPageAvailable = useSharedValue(hasNextPage);

  const onFetchOtherVideosSuccess = (nbResults: number) => {
    if (!nbResults) setOtherVideosRequest(allVideosFeedRequest);
  };

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        let offsetPadding = 40;
        offsetPadding += event.layoutMeasurement.height;
        if (
          event.contentOffset.y >= event.contentSize.height - offsetPadding &&
          !!isNextPageAvailable.value
        ) {
          fetchNextPage();
        }
      },
    },
    [post?.id],
  );

  if (!video) return <BrandText>Video not valid</BrandText>;

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  return (
    <KeyboardAvoidingView extraVerticalOffset={-100}>
      <ScreenContainer
        forceNetworkId={post.networkId}
        fullWidth
        responsive
        noMargin
        footerChildren
        noScroll
        headerMini={<CustomAppBar backEnabled title={`Video by ${username}`} />}
      >
        <Animated.ScrollView
          ref={aref}
          contentContainerStyle={{
            width: "100%",
            alignSelf: "center",
          }}
          onScroll={scrollHandler}
        >
          <View>
            {/*====== Video player ======*/}
            <MediaPlayerVideo
              videoMetadata={video}
              style={{
                aspectRatio: 1.7,
                width: windowWidth - 2,
                borderRadius: SOCIAl_CARD_BORDER_RADIUS,
              }}
              resizeMode={ResizeMode.CONTAIN}
              postId={localPost.id}
            />
            {/*====== Video info ======*/}
            <SpacerColumn size={1.5} />
            <BrandText numberOfLines={2} style={{}}>
              {video.title?.trim()}
            </BrandText>
            <SpacerColumn size={1.5} />
            <View>
              <SocialCardHeader
                authorId={localPost.authorId}
                createdAt={localPost.createdAt}
              />
              <SpacerColumn size={1} />
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
                  style={[
                    fontSemibold14,
                    { color: neutralA3, marginVertical: layout.spacing_x1_5 },
                  ]}
                  numberOfLines={3}
                >
                  {video.description?.trim()}
                </BrandText>
              </>
            )}

            <SpacerColumn size={2} />
            <SpacerColumn size={2} />
            <BrandText style={fontSemibold16}>
              {comments.length} comments
            </BrandText>
            <SpacerColumn size={1.5} />
            {comments.map((comment, index) => (
              <Fragment key={index}>
                <SpacerColumn size={2.5} />
                <VideoComment comment={comment} />
              </Fragment>
            ))}
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
          </View>
        </Animated.ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: neutral00,
            paddingVertical: layout.spacing_x0_75,
          }}
        >
          <MiniCommentInput
            style={{
              alignSelf: "center",
            }}
            ref={feedInputRef}
            replyTo={replyTo}
            parentId={post.id}
            onSubmitInProgress={handleSubmitInProgress}
            onSubmitSuccess={() => {
              setReplyTo(undefined);
              refetchComments();
            }}
          />
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};
