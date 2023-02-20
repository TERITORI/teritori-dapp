import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CommentsContainer } from "../../components/cards/CommentsContainer";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../components/socialFeed/NewsFeed/NewsFeedInput";
import { RefreshButton } from "../../components/socialFeed/NewsFeed/RefreshButton/RefreshButton";
import { RefreshButtonRound } from "../../components/socialFeed/NewsFeed/RefreshButton/RefreshButtonRound";
import { SocialThreadCard } from "../../components/socialFeed/SocialThread/SocialThreadCard";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/useFetchComments";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import {
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";
import { ReplyToType } from "./types";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
  const [refresh, setRefresh] = useState(0);
  const [parentOffsetValue, setParentOffsetValue] = useState(0);
  const { triggerError } = useErrorHandler();
  const [post, setPost] = useState<PostResult>();
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const aref = useAnimatedRef<Animated.ScrollView>();

  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [threadCardOffsetY, setThreadCardOffsetY] = useState(0);

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const isFirstLoad = useSharedValue(true);
  const { data, refetch, hasNextPage, fetchNextPage, isFetching } =
    useFetchComments({
      parentId: post?.identifier,
      totalCount: post?.sub_post_length,
    });
  const isNextPageAvailable = useSharedValue(hasNextPage);

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );

  const fetchPost = async () => {
    try {
      isLoadingValue.value = true;
      const client = await socialFeedClient({
        walletAddress: wallet?.address || "",
      });
      const _post = await client.queryPost({ identifier: id });
      setPost(_post);
    } catch (error) {
      triggerError({ error });
    } finally {
      isLoadingValue.value = false;
    }
  };

  const onPressReply: OnPressReplyType = (data) => {
    feedInputRef.current?.resetForm();
    setReplyTo(data);
    feedInputRef.current?.setValue(`@${data.username} `);
    feedInputRef.current?.focusInput();
  };

  useEffect(() => {
    fetchPost();
  }, [id, wallet?.connected]);

  useEffect(() => {
    refetch();
    if (post) {
      setTimeout(() => {
        isFirstLoad.value = false;
      }, 1300);
    }
  }, [post?.identifier, refresh]);

  useEffect(() => {
    // HECK: updated state was not showing up in scrollhander
    isNextPageAvailable.value = hasNextPage;
  }, [hasNextPage]);

  useEffect(() => {
    if (isFetching) {
      isGoingUp.value = false;
      isLoadingValue.value = true;
    } else {
      isLoadingValue.value = false;
    }
  }, [isFetching]);

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
    [post?.identifier]
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId) aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  return (
    <ScreenContainer
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>
          {post?.parent_post_identifier ? "Sub-Posted" : "Posted"} by{" "}
          {post?.post_by || ""}
        </BrandText>
      }
      onBackPress={() => {
        post?.parent_post_identifier
          ? navigation.navigate("FeedPostView", {
              id: post?.parent_post_identifier || "",
            })
          : navigation.navigate("Feed");
      }}
      footerChildren
      fullWidth
      noScroll
    >
      <Animated.ScrollView
        ref={aref}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
      >
        {!!post && (
          <View
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => setThreadCardOffsetY(height)}
          >
            <SocialThreadCard
              post={post}
              isPostConsultation
              refresh={refresh}
              onPressReply={onPressReply}
            />
          </View>
        )}

        {/*========== Refresh button */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: threadCardOffsetY + layout.contentPadding - 22,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
              paddingRight: screenContainerContentMarginHorizontal * 2,
            },
          ]}
        >
          <RefreshButton
            isRefreshing={isLoadingValue}
            onPress={() => {
              refetch();
              setRefresh((prev) => ++prev);
            }}
          />
        </Animated.View>

        <View onLayout={(e) => setParentOffsetValue(e.nativeEvent.layout.y)}>
          <CommentsContainer
            comments={comments}
            onPressReply={onPressReply}
            refresh={refresh}
            onScrollTo={(y) => aref.current?.scrollTo(y)}
            parentOffsetValue={parentOffsetValue}
          />
        </View>
      </Animated.ScrollView>

      {flatListContentOffsetY >= threadCardOffsetY + 66 && (
        <View style={styles.floatingActions}>
          <RefreshButtonRound isRefreshing={isLoadingValue} onPress={refetch} />
        </View>
      )}

      <View style={styles.footer}>
        <NewsFeedInput
          ref={feedInputRef}
          type="comment"
          parentId={id}
          replyTo={replyTo}
          onSubmitInProgress={handleSubmitInProgress}
          onSubmitSuccess={() => setReplyTo(undefined)}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: layout.contentPadding,
    paddingHorizontal: screenContainerContentMarginHorizontal,
  },
  footer: {
    marginBottom: layout.padding_x2,
    marginHorizontal: screenContainerContentMarginHorizontal,
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
