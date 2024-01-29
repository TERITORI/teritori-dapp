import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

import { Post } from "../../../api/feed/v1/feed";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { MobileTitle } from "../../../components/ScreenContainer/ScreenContainerMobile";
import {
  CommentsContainer,
  LINES_HORIZONTAL_SPACE,
} from "../../../components/cards/CommentsContainer";
import { CreateShortPostButton } from "../../../components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostButton";
import { CreateShortPostModal } from "../../../components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostModal";
import {
  PostCategory,
  ReplyToType,
} from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../../components/socialFeed/NewsFeed/NewsFeedInput";
import { RefreshButton } from "../../../components/socialFeed/NewsFeed/RefreshButton/RefreshButton";
import { RefreshButtonRound } from "../../../components/socialFeed/NewsFeed/RefreshButton/RefreshButtonRound";
import { SocialThreadCard } from "../../../components/socialFeed/SocialCard/cards/SocialThreadCard";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../../hooks/feed/useFetchComments";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { getNetworkObjectId, parseUserId } from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { DEFAULT_USERNAME } from "../../../utils/social-feed";
import { fontSemibold20 } from "../../../utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { OnPressReplyType } from "../FeedPostViewScreen";

export const FeedPostDefaultView: FC<{
  networkId: string;
  post: Post;
  refetchPost: () => Promise<any>;
  isLoadingPost?: boolean;
}> = ({ post, networkId, refetchPost, isLoadingPost }) => {
  const navigation = useAppNavigation();

  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  const [parentOffsetValue, setParentOffsetValue] = useState(0);

  const postId = post.identifier;

  useEffect(() => {
    if (post?.category === PostCategory.Video)
      navigation.replace("FeedPostView", {
        id: postId,
      });
  }, [post?.category, postId, navigation]);

  const authorId = post?.authorId;
  const authorNSInfo = useNSUserInfo(authorId);

  const [, authorAddress] = parseUserId(post?.authorId);

  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const aref = useAnimatedRef<Animated.ScrollView>();
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [threadCardOffsetY, setThreadCardOffsetY] = useState(0);
  const [threadCardWidth, setThreadCardWidth] = useState(0);
  const isGoingUp = useSharedValue(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const {
    data,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingComments,
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
  const isLoadingSharedValue = useSharedValue(true);
  useEffect(() => {
    isLoadingSharedValue.value = isLoadingPost || isLoadingComments;
  }, [isLoadingPost, isLoadingComments, isLoadingSharedValue]);

  const onPressReply: OnPressReplyType = (data) => {
    feedInputRef.current?.resetForm();
    setReplyTo(data);
    feedInputRef.current?.setValue(`@${data.username} `);
    feedInputRef.current?.focusInput();
  };

  useEffect(() => {
    // HECK: updated state was not showing up in scrollhander
    isNextPageAvailable.value = hasNextPage;
  }, [hasNextPage, isNextPageAvailable]);

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
    [post?.identifier],
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  const headerLabel = useMemo(() => {
    const authorDisplayName =
      authorNSInfo?.metadata?.tokenId ||
      tinyAddress(authorAddress) ||
      DEFAULT_USERNAME;

    if (post?.parentPostIdentifier) {
      return `Comment by ${authorDisplayName}`;
    }

    if (post.category === PostCategory.MusicAudio) {
      return `Track by ${authorDisplayName}`;
    }

    return `Post by ${authorDisplayName}`;
  }, [post, authorNSInfo?.metadata?.tokenId, authorAddress]);

  return (
    <ScreenContainer
      forceNetworkId={networkId}
      fullWidth
      responsive
      noMargin
      headerChildren={
        <BrandText style={fontSemibold20}>{headerLabel}</BrandText>
      }
      onBackPress={() =>
        post?.parentPostIdentifier
          ? navigation.navigate("FeedPostView", {
              id: getNetworkObjectId(
                networkId,
                post?.parentPostIdentifier || "",
              ),
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
          {!!post && (
            <View
              onLayout={({
                nativeEvent: {
                  layout: { height, width },
                },
              }) => {
                setThreadCardOffsetY(height);
                setThreadCardWidth(width);
              }}
              style={{ width: "100%" }}
            >
              <SocialThreadCard
                refetchFeed={refetchPost}
                style={
                  windowWidth < RESPONSIVE_BREAKPOINT_S && {
                    borderRadius: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                  }
                }
                post={post}
                isPostConsultation
                onPressReply={onPressReply}
              />
            </View>
          )}
          {/*========== Refresh button no mobile */}
          {!isMobile && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: threadCardOffsetY + 6,
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
                isMobile
                  ? threadCardWidth
                  : threadCardWidth - LINES_HORIZONTAL_SPACE
              }
              comments={comments}
              onPressReply={onPressReply}
              parentOffsetValue={parentOffsetValue}
            />
          </View>
        </View>
      </Animated.ScrollView>

      {flatListContentOffsetY >= threadCardOffsetY + 66 && !isMobile && (
        <View style={floatingActionsCStyle}>
          <RefreshButtonRound
            isRefreshing={isLoadingSharedValue}
            onPress={refetchComments}
          />
        </View>
      )}

      {/*========== Refresh button and Comment button mobile */}
      {isMobile ? (
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
      ) : (
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
        parentId={post.identifier}
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
