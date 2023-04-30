import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { BrandText } from "../../components/BrandText";
import { NotFound } from "../../components/NotFound";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import {
  CommentsContainer,
  LINES_HORIZONTAL_SPACE,
} from "../../components/cards/CommentsContainer";
import {
  PostCategory,
  ReplyToType,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../components/socialFeed/NewsFeed/NewsFeedInput";
import { RefreshButton } from "../../components/socialFeed/NewsFeed/RefreshButton/RefreshButton";
import { RefreshButtonRound } from "../../components/socialFeed/NewsFeed/RefreshButton/RefreshButtonRound";
import { SocialThreadCard } from "../../components/socialFeed/SocialThread/SocialThreadCard";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/feed/useFetchComments";
import { usePost } from "../../hooks/feed/usePost";
import { useNSUserInfo } from "../../hooks/name-service/useNSUserInfo";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getUserId, NetworkKind, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { DEFAULT_USERNAME, postResultToPost } from "../../utils/social-feed";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "../../utils/style/layout";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  const selectedNetworkId = useSelectedNetworkId();
  const [parentOffsetValue, setParentOffsetValue] = useState(0);
  const { post: postResult, isLoading: isLoadingPostResult } = usePost(
    id,
    selectedNetworkId
  );
  const authorNSInfo = useNSUserInfo(
    getUserId(selectedNetworkId, postResult?.post_by)
  );
  const [, userAddress] = parseUserId(postResult?.post_by);
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const aref = useAnimatedRef<Animated.ScrollView>();
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [threadCardOffsetY, setThreadCardOffsetY] = useState(0);
  const [threadCardWidth, setThreadCardWidth] = useState(0);
  const isGoingUp = useSharedValue(false);
  const {
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingComments,
  } = useFetchComments({
    parentId: postResult?.identifier,
    totalCount: postResult?.sub_post_length,
    enabled: true,
  });
  const isNextPageAvailable = useSharedValue(hasNextPage);
  const isLoadingSharedValue = useSharedValue(true);

  useEffect(() => {
    isLoadingSharedValue.value = isLoadingPostResult || isLoadingComments;
  }, [isLoadingPostResult, isLoadingComments, isLoadingSharedValue]);

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );

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
        setFlatListContentOffsetY(event.contentOffset.y);
      },
    },
    [postResult?.identifier]
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  const headerLabel = useMemo(() => {
    if (isLoadingPostResult) return "Loading Post...";
    else if (!postResult) return "Post not found";
    const author =
      authorNSInfo?.metadata?.tokenId || userAddress || DEFAULT_USERNAME;
    if (postResult.category === PostCategory.Article)
      return `Article by ${author}`;
    if (postResult?.parent_post_identifier) return `Comment by ${author}`;
    return `Post by ${author}`;
  }, [
    postResult,
    authorNSInfo?.metadata?.tokenId,
    userAddress,
    isLoadingPostResult,
  ]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      fullWidth
      responsive
      noMargin
      headerChildren={
        <BrandText style={fontSemibold20}>{headerLabel}</BrandText>
      }
      onBackPress={() =>
        postResult?.parent_post_identifier
          ? navigation.navigate("FeedPostView", {
              id: postResult?.parent_post_identifier || "",
            })
          : navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Feed")
      }
      footerChildren
      noScroll
    >
      {isLoadingPostResult ? (
        <ActivityIndicator
          color={primaryColor}
          size="large"
          style={{ marginTop: layout.padding_x4 }}
        />
      ) : !postResult ? (
        <NotFound label="Post" />
      ) : (
        <>
          <Animated.ScrollView
            ref={aref}
            contentContainerStyle={styles.contentContainer}
            onScroll={scrollHandler}
            scrollEventThrottle={1}
          >
            {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
            {isMobile && <MobileTitle title={headerLabel.toUpperCase()} />}
            <View
              style={{
                width:
                  windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
                maxWidth: screenContentMaxWidth,
                alignItems: "center",
                paddingVertical: layout.padding_x2,
              }}
            >
              {!!postResult && (
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
                    style={
                      windowWidth < RESPONSIVE_BREAKPOINT_S && {
                        borderRadius: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      }
                    }
                    post={postResultToPost(selectedNetworkId, postResult)}
                    isPostConsultation
                    onPressReply={onPressReply}
                  />
                </View>
              )}
              {/*========== Refresh button */}
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
                    refetch();
                  }}
                />
              </Animated.View>

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

          {flatListContentOffsetY >= threadCardOffsetY + 66 && (
            <View style={styles.floatingActions}>
              <RefreshButtonRound
                isRefreshing={isLoadingSharedValue}
                onPress={refetch}
              />
            </View>
          )}

          <NewsFeedInput
            style={{ alignSelf: "center" }}
            ref={feedInputRef}
            type="comment"
            parentId={id}
            replyTo={replyTo}
            onSubmitInProgress={handleSubmitInProgress}
            onSubmitSuccess={() => {
              setReplyTo(undefined);
              refetch();
            }}
          />
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    alignSelf: "center",
  },
  indicator: {
    marginBottom: 56,
    marginLeft: 56,
  },
  floatingActions: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 68,
    bottom: 230,
  },
});
