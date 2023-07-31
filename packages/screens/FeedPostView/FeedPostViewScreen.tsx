import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
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
import { CreateShortPostButton } from "../../components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostButton";
import { CreateShortPostModal } from "../../components/socialFeed/NewsFeed/CreateShortPost/CreateShortPostModal";
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
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/feed/useFetchComments";
import { usePost } from "../../hooks/feed/usePost";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import {
  getNetworkObjectId,
  parseNetworkObjectId,
  parseUserId,
} from "../../networks";
import { gnoTeritoriNetwork } from "../../networks/gno-teritori";
import { teritoriNetwork } from "../../networks/teritori";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { DEFAULT_USERNAME } from "../../utils/social-feed";
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

  let [network, postId] = parseNetworkObjectId(id);
  if (!network) {
    // fallback to teritori or gno network if there is no network prefix in the id
    if (id.includes("-")) {
      // teritori ids are uuids
      network = teritoriNetwork;
      postId = id;
    } else {
      // gno ids are integers
      network = gnoTeritoriNetwork;
      postId = id;
    }
  }
  const networkId = network?.id;

  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  const [parentOffsetValue, setParentOffsetValue] = useState(0);
  const { post: postResult, isLoading: isLoadingPostResult } = usePost(
    postId,
    networkId
  );

  const authorId = postResult?.authorId;
  const authorNSInfo = useNSUserInfo(authorId);

  const [, authorAddress] = parseUserId(postResult?.authorId);

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
    refetch,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingComments,
  } = useFetchComments({
    parentId: postResult?.identifier,
    totalCount: postResult?.subPostLength,
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
          runOnJS(fetchNextPage)();
        }

        if (flatListContentOffsetY > event.contentOffset.y) {
          isGoingUp.value = true;
        } else if (flatListContentOffsetY < event.contentOffset.y) {
          isGoingUp.value = false;
        }
        runOnJS(setFlatListContentOffsetY)(event.contentOffset.y);
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
    const authorDisplayName =
      authorNSInfo?.metadata?.tokenId || authorAddress || DEFAULT_USERNAME;

    if (postResult.category === PostCategory.Article) {
      return `Article by ${authorDisplayName}`;
    }

    if (postResult?.parentPostIdentifier) {
      return `Comment by ${authorDisplayName}`;
    }

    return `Post by ${authorDisplayName}`;
  }, [
    postResult,
    authorNSInfo?.metadata?.tokenId,
    authorAddress,
    isLoadingPostResult,
  ]);

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
        postResult?.parentPostIdentifier
          ? navigation.navigate("FeedPostView", {
              id: getNetworkObjectId(
                networkId,
                postResult?.parentPostIdentifier || ""
              ),
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
          style={{ marginTop: layout.spacing_x4 }}
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
                paddingVertical: layout.spacing_x2,
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
                    refetchFeed={refetch}
                    style={
                      windowWidth < RESPONSIVE_BREAKPOINT_S && {
                        borderRadius: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                      }
                    }
                    post={postResult}
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
                      refetch();
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
            <View style={styles.floatingActions}>
              <RefreshButtonRound
                isRefreshing={isLoadingSharedValue}
                onPress={refetch}
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
                    refetch();
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
              parentId={postId}
              replyTo={replyTo}
              onSubmitInProgress={handleSubmitInProgress}
              onSubmitSuccess={() => {
                setReplyTo(undefined);
                refetch();
              }}
            />
          )}
        </>
      )}

      <CreateShortPostModal
        isVisible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmitSuccess={() => {
          setReplyTo(undefined);
          refetch();
        }}
      />
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
