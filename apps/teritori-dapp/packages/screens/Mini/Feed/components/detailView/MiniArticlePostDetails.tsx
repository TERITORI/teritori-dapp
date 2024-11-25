import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import defaultThumbnailImage from "@/assets/default-images/default-article-thumbnail.png";
import CustomAppBar from "../../../components/AppBar/CustomAppBar";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CommentsContainer } from "@/components/cards/CommentsContainer";
import { RichText } from "@/components/socialFeed/RichText";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SocialCardWrapper } from "@/components/socialFeed/SocialCard/SocialCardWrapper";
import { SpacerColumn } from "@/components/spacer";
import { useFetchComments } from "@/hooks/feed/useFetchComments";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import {
  MiniCommentInput,
  MiniCommentInputInputHandle,
} from "@/screens/Mini/components/MiniCommentInput";
import { zodTryParseJSON } from "@/utils/sanitize";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { neutral00 } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { ReplyToType, ZodSocialFeedArticleMetadata } from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchPost: () => Promise<any>;
};

export const MiniArticlePostDetails = ({ post, refetchPost }: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  const aref = useAnimatedRef<Animated.ScrollView>();
  const feedInputRef = useRef<MiniCommentInputInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();

  const [localPost, setLocalPost] = useState(post || Post.create());

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
    data: comments,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
    // isLoading: isLoadingComments,
  } = useFetchComments({
    parentId: post.id,
    totalCount: post.subPostLength,
    enabled: true,
  });

  const isNextPageAvailable = useSharedValue(hasNextPage);
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
    [post.id],
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };
  if (!metadataToUse) return null;

  return (
    <KeyboardAvoidingView extraVerticalOffset={-100}>
      <ScreenContainer
        forceNetworkId={post.networkId}
        fullWidth
        responsive
        noMargin
        footerChildren
        noScroll
        headerMini={
          <CustomAppBar backEnabled title={`Article by ${username}`} />
        }
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
          }}
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
                  authorId={localPost.authorId}
                  createdAt={post.createdAt}
                  postWithLocationId={articleMetadata?.location && localPost.id}
                />

                {/*========== Article content */}
                <View>
                  <RichText
                    initialValue={metadataToUse.message}
                    isPostConsultation
                    audioFiles={audioFiles}
                    postId={post.id}
                    authorId={authorId}
                  />
                </View>
                <SpacerColumn size={1.5} />
              </SocialCardWrapper>
              <View>
                <SpacerColumn size={4} />
                <CommentsContainer
                  cardWidth={windowWidth}
                  comments={comments}
                  onPressReply={() => {}}
                />
              </View>
            </View>
          </Animated.ScrollView>
          <View
            style={{
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
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};
