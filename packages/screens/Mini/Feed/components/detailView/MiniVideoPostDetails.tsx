import { ResizeMode } from "expo-av";
import React, { Fragment, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import useSelectedWallet from "../../../../../hooks/useSelectedWallet";
import CustomAppBar from "../../../components/AppBar/CustomAppBar";
import { VideoCommentInput } from "../VideoCommentInput";

import { Post, PostsRequest } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MediaPlayerVideo } from "@/components/mediaPlayer/MediaPlayerVideo";
import { DislikeButton } from "@/components/socialFeed/SocialActions/DislikeButton";
import { LikeButton } from "@/components/socialFeed/SocialActions/LikeButton";
import { ReportButton } from "@/components/socialFeed/SocialActions/ReportButton";
import { ShareButton } from "@/components/socialFeed/SocialActions/ShareButton";
import { TipButton } from "@/components/socialFeed/SocialActions/TipButton";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SOCIAl_CARD_BORDER_RADIUS } from "@/components/socialFeed/SocialCard/cards/SocialThreadCard";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { VideosList } from "@/components/video/VideosList";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "@/hooks/feed/useFetchComments";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { getNetwork, NetworkKind, parseUserId } from "@/networks";
import { VideoComment } from "@/screens/FeedPostView/components/VideoComment";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  BASE_POST,
  DEFAULT_USERNAME,
  postResultToPost,
} from "@/utils/social-feed";
import { neutralA3 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { PostCategory, ZodSocialFeedVideoMetadata } from "@/utils/types/feed";

type Props = {
  networkId: string;
  post: Post;
  refetchPost: () => Promise<any>;
};

export const MiniVideoPostDetails = ({
  networkId,
  post,
  refetchPost,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const wallet = useSelectedWallet();
  const network = getNetwork(networkId);

  const [localPost, setLocalPost] = useState(post || BASE_POST);
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, localPost.metadata);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const username =
    authorNSInfo?.metadata?.tokenId ||
    tinyAddress(authorAddress) ||
    DEFAULT_USERNAME;

  const {
    data: commentsData,
    hasNextPage,
    fetchNextPage,
  } = useFetchComments({
    parentId: localPost.identifier,
    totalCount: localPost.subPostLength,
    enabled: true,
  });

  const comments = useMemo(
    () => (commentsData ? combineFetchCommentPages(commentsData.pages) : []),
    [commentsData],
  );

  const userVideosFeedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Video],
      user: localPost.authorId,
      mentions: [],
      hashtags: [],
      premiumLevelMax: -1,

      premiumLevelMin: 0,
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
      premiumLevelMax: -1,

      premiumLevelMin: 0,
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
    [post?.identifier],
  );

  if (!video) return <BrandText>Video not valid</BrandText>;

  return (
    <ScreenContainer
      forceNetworkId={networkId}
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
            authorId={localPost.authorId}
            postId={localPost.identifier}
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
              authorAddress={authorAddress}
              createdAt={localPost.createdAt}
              authorMetadata={authorNSInfo?.metadata}
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
                author={username}
                postId={localPost.identifier}
                useAltStyle
              />

              <SpacerRow size={1.5} />
              <ShareButton postId={localPost.identifier} useAltStyle />

              {network?.kind === NetworkKind.Gno && (
                <>
                  <SpacerRow size={1.5} />
                  <ReportButton
                    refetchFeed={refetchPost}
                    postId={localPost.identifier}
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
          <VideoCommentInput
            count={comments.length}
            networkId={networkId}
            post={localPost}
            onComment={refetchPost}
          />
          {comments.map((comment, index) => (
            <Fragment key={index}>
              <SpacerColumn size={2.5} />
              <VideoComment comment={postResultToPost(networkId, comment)} />
            </Fragment>
          ))}
          <VideosList
            consultedPostId={localPost.identifier}
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
    </ScreenContainer>
  );
};
