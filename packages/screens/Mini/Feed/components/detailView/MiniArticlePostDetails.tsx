import React, { useEffect, useMemo, useState } from "react";
import { Image, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { Post } from "../../../../../api/feed/v1/feed";
import { BrandText } from "../../../../../components/BrandText";
import { ScreenContainer } from "../../../../../components/ScreenContainer";
import { CommentsContainer } from "../../../../../components/cards/CommentsContainer";
import { ZodSocialFeedArticleMetadata } from "../../../../../components/socialFeed/NewsFeed/NewsFeed.type";
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
import { web3ToWeb2URI } from "../../../../../utils/ipfs";
import { zodTryParseJSON } from "../../../../../utils/sanitize";
import {
  ARTICLE_COVER_IMAGE_MAX_HEIGHT,
  ARTICLE_COVER_IMAGE_RATIO,
  BASE_POST,
  DEFAULT_USERNAME,
} from "../../../../../utils/social-feed";
import { fontSemibold16 } from "../../../../../utils/style/fonts";
import { tinyAddress } from "../../../../../utils/text";
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
    articleMetadata?.coverImage ||
    metadataToUse?.files?.find((file) => file.isCoverImage);

  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const [, authorAddress] = parseUserId(localPost.authorId);

  const {
    data,
    // refetch: refetchComments,
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
        // scrollEventThrottle={1}
      >
        <View style={{ flex: 1 }}>
          <SocialCardWrapper post={localPost} refetchFeed={refetchPost}>
            {!!coverImage && (
              <>
                <Image
                  source={{ uri: web3ToWeb2URI(coverImage.url) }}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    aspectRatio: ARTICLE_COVER_IMAGE_RATIO,
                    // height: ARTICLE_COVER_IMAGE_MAX_HEIGHT/1.6,
                    maxHeight: ARTICLE_COVER_IMAGE_MAX_HEIGHT,
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

            <RichText
              initialValue={metadataToUse.message}
              isPostConsultation
              audioFiles={audioFiles}
              postId={postId}
              authorId={authorId}
            />
            <SpacerColumn size={1.5} />
          </SocialCardWrapper>
          <View>
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
