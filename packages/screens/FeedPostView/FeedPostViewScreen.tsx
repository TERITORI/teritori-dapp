import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { RefreshButton } from "../../components/RefreshButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CommentsContainer } from "../../components/cards/CommentsContainer";
import { SocialThreadCard } from "../../components/cards/SocialThreadCard";
import { BackTo } from "../../components/navigation/BackTo";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../components/socialFeed/NewsFeed/NewsFeedInput";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/useFetchComments";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { ReplyToType } from "./types";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const wallet = useSelectedWallet();
  const [refresh, setRefresh] = useState(0);
  const [parentOffsetValue, setParentOffsetValue] = useState(0);
  const { triggerError } = useErrorHandler();
  const [post, setPost] = useState<PostResult>();
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const aref = useAnimatedRef<Animated.ScrollView>();

  const isLoadingValue = useSharedValue(false);
  const translationY = useSharedValue(0);
  const isGoingUp = useSharedValue(false);
  const btnOffsetValue = useSharedValue(0);
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

        if (translationY.value > event.contentOffset.y) {
          isGoingUp.value = true;
        } else if (translationY.value < event.contentOffset.y) {
          isGoingUp.value = false;
        }
        translationY.value = event.contentOffset.y;
      },
    },
    [post?.identifier]
  );

  const animationStyle = useAnimatedStyle(() => {
    let animeValue = isFirstLoad.value ? 0 : btnOffsetValue.value;

    if (isLoadingValue.value) {
      if (translationY.value >= btnOffsetValue.value && !isGoingUp.value) {
        animeValue = withSpring(translationY.value);
      } else if (isGoingUp.value && translationY.value > btnOffsetValue.value) {
        animeValue = translationY.value - btnOffsetValue.value;
      }
    } else if (translationY.value < btnOffsetValue.value) {
      animeValue = isFirstLoad.value
        ? withSpring(btnOffsetValue.value)
        : btnOffsetValue.value;
    } else {
      animeValue = translationY.value - 100;
    }

    return {
      position: "absolute",
      zIndex: 10000,
      transform: [
        {
          translateY: animeValue,
        },
      ],
      left: 0,
      right: 0,
    };
  }, [post?.identifier, translationY.value]);

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId) aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  const ListHeaderComponent = useCallback(
    () => (
      <Animated.View
        style={[{ paddingVertical: layout.padding_x1 }, animationStyle]}
      >
        <RefreshButton
          isRefreshing={isLoadingValue}
          onPress={() => {
            refetch();
            setRefresh((prev) => ++prev);
          }}
          widthToAnimate={140}
        />
      </Animated.View>
    ),
    [isLoadingValue]
  );

  return (
    <ScreenContainer
      responsive
      headerChildren={<BackTo label="Feed" />}
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
                layout: { height: h },
              },
            }) => (btnOffsetValue.value = h)}
          >
            <SocialThreadCard
              post={post}
              singleView
              refresh={refresh}
              onPressReply={onPressReply}
            />
          </View>
        )}
        <ListHeaderComponent />
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
    paddingHorizontal: layout.contentPadding,
  },
  footer: {
    marginBottom: layout.padding_x2,
    marginHorizontal: layout.contentPadding,
  },
  indicator: {
    marginBottom: 56,
    marginLeft: 56,
  },
});
