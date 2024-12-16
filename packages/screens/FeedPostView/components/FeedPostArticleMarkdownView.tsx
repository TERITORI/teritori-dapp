import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, useWindowDimensions, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import RenderHtml from "react-native-render-html";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { CommentsContainer } from "@/components/cards/CommentsContainer";
import { CreateShortPostButton } from "@/components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostButton";
import { CreateShortPostModal } from "@/components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostModal";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "@/components/socialFeed/NewsFeed/NewsFeedInput";
import { RefreshButton } from "@/components/socialFeed/NewsFeed/RefreshButton/RefreshButton";
import { RefreshButtonRound } from "@/components/socialFeed/NewsFeed/RefreshButton/RefreshButtonRound";
import { SocialCardFooter } from "@/components/socialFeed/SocialCard/SocialCardFooter";
import { SocialCardHeader } from "@/components/socialFeed/SocialCard/SocialCardHeader";
import { SocialCardWrapper } from "@/components/socialFeed/SocialCard/SocialCardWrapper";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFetchComments } from "@/hooks/feed/useFetchComments";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { markdownTagStyles, articleMd as md } from "@/utils/feed/markdown";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  ARTICLE_MAX_WIDTH,
  DEFAULT_USERNAME,
  LINES_HORIZONTAL_SPACE,
  SOCIAl_CARD_BORDER_RADIUS,
} from "@/utils/social-feed";
import { neutral33 } from "@/utils/style/colors";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import {
  OnPressReplyType,
  PostCategory,
  ReplyToType,
  ZodSocialFeedArticleMetadata,
} from "@/utils/types/feed";

const contentPaddingHorizontal = layout.spacing_x2;

export const FeedPostArticleMarkdownView: FC<{
  post: Post;
  refetchPost: () => Promise<any>;
  isLoadingPost?: boolean;
}> = ({ post, refetchPost, isLoadingPost }) => {
  const navigation = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  const [parentOffsetValue, setParentOffsetValue] = useState(0);

  const authorId = post?.authorId;
  const authorNSInfo = useNSUserInfo(authorId);
  const [, authorAddress] = parseUserId(post?.authorId);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;

  const [localPost, setLocalPost] = useState(post);
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const aref = useAnimatedRef<Animated.ScrollView>();
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [articleOffsetY, setArticleOffsetY] = useState(0);
  const [articleWidth, setArticleWidth] = useState(0);
  const [renderHtmlWidth, setRenderHtmlWidth] = useState(0);
  const isGoingUp = useSharedValue(false);
  const isLoadingSharedValue = useSharedValue(true);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const {
    data: comments,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingComments,
  } = useFetchComments({
    parentId: post.id,
    totalCount: post.subPostLength,
    enabled: true,
  });
  const isNextPageAvailable = useSharedValue(hasNextPage);

  const articleMetadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    post.metadata,
  );
  const message = articleMetadata?.message;
  const html = message ? md.render(message) : null;
  const title = articleMetadata?.title;
  const location = articleMetadata?.location;

  const headerLabel = useMemo(() => {
    const authorDisplayName =
      authorNSInfo?.metadata?.tokenId ||
      tinyAddress(authorAddress) ||
      DEFAULT_USERNAME;
    return `Article by ${authorDisplayName}`;
  }, [authorNSInfo?.metadata?.tokenId, authorAddress]);

  const onPressReply: OnPressReplyType = (data) => {
    feedInputRef.current?.resetForm();
    setReplyTo(data);
    feedInputRef.current?.setValue(`@${username} `);
    feedInputRef.current?.focusInput();
  };

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
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
        setFlatListContentOffsetY(event.contentOffset.y);
      },
    },
    [post.id],
  );

  useEffect(() => {
    isLoadingSharedValue.value = isLoadingPost || isLoadingComments;
  }, [isLoadingPost, isLoadingComments, isLoadingSharedValue]);

  useEffect(() => {
    if (post.category === PostCategory.Video)
      navigation.replace("FeedPostView", {
        id: post.id,
      });
  }, [post.category, post.id, navigation]);

  useEffect(() => {
    // HECK: updated state was not showing up in scrollhander
    isNextPageAvailable.value = hasNextPage;
  }, [hasNextPage, isNextPageAvailable]);

  if (!articleMetadata || !html) return null;
  return (
    <ScreenContainer
      forceNetworkId={post.networkId}
      fullWidth
      responsive
      noMargin
      headerChildren={<ScreenTitle>{headerLabel}</ScreenTitle>}
      onBackPress={() =>
        post?.parentPostIdentifier
          ? navigation.navigate("FeedPostView", {
              id: post.id,
            })
          : navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("Feed")
      }
      footerChildren
      noScroll
    >
      <Animated.ScrollView
        ref={aref}
        contentContainerStyle={contentContainerCStyle}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      >
        {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
        {isMobile && <MobileTitle title={headerLabel.toUpperCase()} />}
        <View
          style={{
            width: windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
            maxWidth: screenContentMaxWidth,
            alignItems: "center",
            paddingVertical: layout.spacing_x2,
          }}
        >
          <View
            onLayout={({
              nativeEvent: {
                layout: { height, width },
              },
            }) => {
              setArticleOffsetY(height);
              setArticleWidth(width);
            }}
            style={{
              width: "100%",
              maxWidth: ARTICLE_MAX_WIDTH + contentPaddingHorizontal * 2,
              borderBottomWidth: 1,
              borderBottomColor: neutral33,
              borderRadius:
                windowWidth < RESPONSIVE_BREAKPOINT_S
                  ? 0
                  : SOCIAl_CARD_BORDER_RADIUS,
              paddingHorizontal: contentPaddingHorizontal,
              paddingBottom: layout.spacing_x2,
            }}
          >
            <SocialCardWrapper post={localPost} refetchFeed={refetchPost}>
              {/*========== Article title, author info */}
              {!!title && <BrandText>{title}</BrandText>}

              <SpacerColumn size={1.5} />
              <SocialCardHeader
                authorId={localPost.authorId}
                createdAt={post.createdAt}
                postWithLocationId={location && localPost.id}
              />
              <SpacerColumn size={1.5} />

              {/*========== Article content */}
              <View
                style={{
                  minHeight: "auto",
                  position: "relative",
                  zIndex: 99999,
                }}
              >
                <ScrollView
                  onLayout={(e) =>
                    setRenderHtmlWidth(e.nativeEvent.layout.width)
                  }
                >
                  <RenderHtml
                    source={{ html }}
                    tagsStyles={markdownTagStyles}
                    contentWidth={renderHtmlWidth}
                  />
                </ScrollView>
              </View>
              <SpacerColumn size={1.5} />

              {/*========== Actions */}
              <SocialCardFooter
                cardWidth={articleWidth}
                isPostConsultation
                post={localPost}
                handleReply={() => onPressReply({ username })}
                refetchFeed={refetchPost}
                setPost={setLocalPost}
              />
            </SocialCardWrapper>
          </View>

          {/*========== Refresh button no mobile */}
          {!isMobile && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: articleOffsetY + 6,
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10000,
                },
              ]}
            >
              <RefreshButton
                isRefreshing={isLoadingSharedValue}
                onPress={() => {
                  refetchComments();
                }}
              />
            </Animated.View>
          )}

          <View
            onLayout={(e) => setParentOffsetValue(e.nativeEvent.layout.y)}
            style={{ width: "100%" }}
          >
            <CommentsContainer
              cardWidth={
                isMobile ? articleWidth : articleWidth - LINES_HORIZONTAL_SPACE
              }
              comments={comments}
              onPressReply={onPressReply}
              parentOffsetValue={parentOffsetValue}
            />
          </View>
        </View>

        {/*========== Comment input */}
        {!isMobile && (
          <>
            <SpacerColumn size={2.5} />
            <NewsFeedInput
              style={{ alignSelf: "center" }}
              ref={feedInputRef}
              type="comment"
              replyTo={replyTo}
              parentId={post.localIdentifier}
              onSubmitInProgress={handleSubmitInProgress}
              onSubmitSuccess={() => {
                setReplyTo(undefined);
                refetchComments();
              }}
            />
          </>
        )}
      </Animated.ScrollView>

      {/*========== Refresh button mobile */}
      {flatListContentOffsetY >= articleOffsetY + 66 && !isMobile && (
        <View style={floatingActionsCStyle}>
          <RefreshButtonRound
            isRefreshing={isLoadingSharedValue}
            onPress={refetchComments}
          />
        </View>
      )}

      {/*========== Refresh button and Comment button mobile */}
      {isMobile && (
        <>
          <SpacerColumn size={2} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreateShortPostButton
              label="Create Comment"
              onPress={() => setCreateModalVisible(true)}
            />
            <SpacerRow size={1.5} />
            <RefreshButton
              isRefreshing={isLoadingSharedValue}
              onPress={() => {
                refetchComments();
              }}
            />
          </View>
          <SpacerColumn size={2} />
        </>
      )}

      <CreateShortPostModal
        label="Create a Comment"
        isVisible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmitSuccess={() => {
          setReplyTo(undefined);
          refetchComments();
        }}
        replyTo={replyTo}
        parentId={post.localIdentifier}
      />
    </ScreenContainer>
  );
};

const contentContainerCStyle: ViewStyle = {
  alignItems: "center",
  alignSelf: "center",
};
const floatingActionsCStyle: ViewStyle = {
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
  right: 68,
  bottom: 230,
};
