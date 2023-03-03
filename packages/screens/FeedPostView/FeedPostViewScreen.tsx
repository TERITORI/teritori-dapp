import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/feed/useFetchComments";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, mustGetCosmosNetwork, NetworkKind } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { postResultToPost } from "../../utils/social-feed";
import { fontSemibold20 } from "../../utils/style/fonts";
import {
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const [refresh, setRefresh] = useState(0);
  const [parentOffsetValue, setParentOffsetValue] = useState(0);
  const { triggerError } = useErrorHandler();
  const [post, setPost] = useState<PostResult>();
  const authorNSInfo = useNSUserInfo(
    getUserId(selectedNetworkId, post?.post_by)
  );
  const network = mustGetCosmosNetwork(selectedNetworkId);
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
        networkId: selectedNetworkId,
        walletAddress: wallet?.address || "",
      });
      const _post = await client.queryPost({ identifier: id });
      setPost(_post);
    } catch (error) {
      triggerError({
        title: "",
        error,
      });
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
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  const headerLabel = () =>
    (post?.category === PostCategory.Article
      ? "Article by "
      : post?.parentPostIdentifier
      ? "Sub-Post by "
      : "Post by ") +
      authorNSInfo.metadata.public_name +
      (network?.nameServiceTLD || "") ||
    post?.post_by ||
    "";

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>{headerLabel()}</BrandText>
      }
      onBackPress={() =>
        post?.parentPostIdentifier
          ? navigation.navigate("FeedPostView", {
              id: post?.parent_post_identifier || "",
            })
          : navigation.navigate("Feed")
      }
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
              post={postResultToPost(selectedNetworkId, post)}
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
            onScrollTo={(y: number) => aref.current?.scrollTo(y)}
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
