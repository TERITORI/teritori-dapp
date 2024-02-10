import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import defaultThumbnailImage from "../../../../../../assets/default-images/default-article-thumbnail.png";
import { Post } from "../../../../../api/feed/v1/feed";
import { BrandText } from "../../../../../components/BrandText";
import { OptimizedImage } from "../../../../../components/OptimizedImage";
import { ScreenContainer } from "../../../../../components/ScreenContainer";
import { CommentsContainer } from "../../../../../components/cards/CommentsContainer";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../../../../components/socialFeed/NewsFeed/NewsFeedInput";
import { RichText } from "../../../../../components/socialFeed/RichText";
import { SocialCardHeader } from "../../../../../components/socialFeed/SocialCard/SocialCardHeader";
import { SocialCardWrapper } from "../../../../../components/socialFeed/SocialCard/SocialCardWrapper";
import { SpacerColumn } from "../../../../../components/spacer";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../../../../hooks/feed/useFetchComments";
import { useNSUserInfo } from "../../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../../networks";
import { zodTryParseJSON } from "../../../../../utils/sanitize";
import { BASE_POST, DEFAULT_USERNAME } from "../../../../../utils/social-feed";
import { fontSemibold16 } from "../../../../../utils/style/fonts";
import { tinyAddress } from "../../../../../utils/text";
import {
  ReplyToType,
  ZodSocialFeedArticleMetadata,
} from "../../../../../utils/types/feed";
import CustomAppBar from "../../../components/AppBar/CustomAppBar";

type Props = {
  networkId: string;
  post: Post;
  refetchPost: () => Promise<any>;
  isLoading?: boolean;
};

export const MiniArticlePostDetails = ({
  networkId,
  post,
  refetchPost,
  isLoading,
}: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  const aref = useAnimatedRef<Animated.ScrollView>();
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();

  const [localPost, setLocalPost] = useState(post || BASE_POST);

  const postMetadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    localPost.metadata,
  );
  const articleMetadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    localPost.metadata,
  );
  const metadataToUse = articleMetadata || postMetadata;
  const audioFiles = useMemo(
    () => metadataToUse?.files?.filter((file) => file.fileType === "audio"),
    [metadataToUse?.files],
  );

  // Old articles doesn't have coverImage, but they have a file with a isCoverImage flag
  const coverImage =
    articleMetadata?.thumbnailImage ||
    metadataToUse?.files?.find((file) => file.isCoverImage);

  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const [, authorAddress] = parseUserId(localPost.authorId);

  const {
    data,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
    // isLoading: isLoadingComments,
  } = useFetchComments({
    parentId: post?.identifier,
    totalCount: post?.subPostLength,
    enabled: true,
  });

  const isNextPageAvailable = useSharedValue(hasNextPage);
  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data],
  );
  const postId = post.identifier;
  const authorId = post?.authorId;
  const username =
    authorNSInfo?.metadata?.tokenId ||
    tinyAddress(authorAddress) ||
    DEFAULT_USERNAME;

  const thumbnailURI = coverImage?.url
    ? coverImage.url.includes("://")
      ? coverImage.url
      : "ipfs://" + coverImage.url
    : defaultThumbnailImage;

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

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
    [postId],
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };
  if (!metadataToUse) return null;

  return (
    <ScreenContainer
      forceNetworkId={networkId}
      fullWidth
      responsive
      noMargin
      footerChildren
      noScroll
      headerMini={<CustomAppBar backEnabled title={`Article by ${username}`} />}
    >
      <Animated.ScrollView
        ref={aref}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      >
        <View style={{ flex: 1, width: windowWidth - 20 }}>
          <SocialCardWrapper post={localPost} refetchFeed={refetchPost}>
            {!!coverImage && (
              <>
                <OptimizedImage
                  width={windowWidth}
                  height={200}
                  sourceURI={thumbnailURI}
                  fallbackURI={defaultThumbnailImage}
                  style={{
                    zIndex: -1,
                    width: windowWidth,
                    height: 200 - 2,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                />
                <SpacerColumn size={3} />
              </>
            )}
            {!!metadataToUse?.title && (
              <>
                <BrandText style={[fontSemibold16]}>
                  {metadataToUse.title}
                </BrandText>
                <SpacerColumn size={1.5} />
              </>
            )}

            <SocialCardHeader
              authorAddress={authorAddress}
              authorId={localPost.authorId}
              createdAt={post.createdAt}
              authorMetadata={authorNSInfo?.metadata}
            />

            {/*========== Article content */}
            <View>
              <RichText
                initialValue={metadataToUse.message}
                isPostConsultation
                audioFiles={audioFiles}
                postId={postId}
                authorId={authorId}
              />
            </View>
            <SpacerColumn size={1.5} />
          </SocialCardWrapper>
          <View>
            <NewsFeedInput
              style={{ alignSelf: "center" }}
              ref={feedInputRef}
              type="comment"
              replyTo={replyTo}
              parentId={post.identifier}
              onSubmitInProgress={handleSubmitInProgress}
              onSubmitSuccess={() => {
                setReplyTo(undefined);
                refetchComments();
              }}
            />
            <CommentsContainer
              cardWidth={windowWidth}
              comments={comments}
              onPressReply={() => {}}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
};
