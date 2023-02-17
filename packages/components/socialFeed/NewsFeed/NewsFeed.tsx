import React, { useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../../hooks/useFetchFeed";
import { layout } from "../../../utils/style/layout";
import { NEWS_FEED_MAX_WIDTH } from "../../../utils/types/feed";
import { RefreshButton } from "../../RefreshButton";
import { SocialThreadCard } from "../SocialThread/SocialThreadCard";
import { NewsFeedInput } from "./NewsFeedInput";

const SCROLL_OFFSET_VALUE = 240;

interface NewsFeedProps {
  Header: React.ComponentType;
  hasInput?: boolean;
  hash?: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  Header,
  hasInput = false,
}) => {
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed();
  const isLoadingValue = useSharedValue(false);
  const translationY = useSharedValue(0);
  const isGoingUp = useSharedValue(false);
  const posts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (translationY.value > event.contentOffset.y) {
        isGoingUp.value = true;
      } else if (translationY.value < event.contentOffset.y) {
        isGoingUp.value = false;
      }
      translationY.value = event.contentOffset.y;
    },
  });

  const animationStyle = useAnimatedStyle(() => {
    let animeValue = 0;

    if (isLoadingValue.value) {
      if (translationY.value >= SCROLL_OFFSET_VALUE && !isGoingUp.value) {
        animeValue = withSpring(translationY.value - SCROLL_OFFSET_VALUE);
      } else if (isGoingUp.value && translationY.value > SCROLL_OFFSET_VALUE) {
        animeValue = translationY.value - SCROLL_OFFSET_VALUE;
      }
    } else if (translationY.value < SCROLL_OFFSET_VALUE) {
      animeValue = 0;
    } else {
      animeValue = translationY.value - (SCROLL_OFFSET_VALUE + 200);
    }

    return {
      transform: [
        {
          translateY: animeValue,
        },
      ],
    };
  }, [translationY.value, isGoingUp.value]);

  useEffect(() => {
    if (isFetching || isLoading) {
      isGoingUp.value = false;
      isLoadingValue.value = true;
    } else {
      isLoadingValue.value = false;
    }
  }, [isFetching, isLoading]);

  // functions
  const onEndReached = () => {
    if (!isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  const ListHeaderComponent = useCallback(
    () => (
      <View>
        <Header />
        {hasInput && (
          <NewsFeedInput
            type="post"
            onSubmitSuccess={refetch}
            style={{ maxWidth: NEWS_FEED_MAX_WIDTH }}
          />
        )}
        <Animated.View
          style={[{ paddingVertical: layout.padding_x1 }, animationStyle]}
        >
          <RefreshButton
            isRefreshing={isLoadingValue}
            onPress={refetch}
            widthToAnimate={140}
          />
        </Animated.View>
      </View>
    ),
    [isLoadingValue, Header]
  );

  return (
    <Animated.FlatList
      scrollEventThrottle={0.1}
      data={posts as PostResult[]}
      renderItem={({ item: post }) => (
        <SocialThreadCard
          post={post}
          style={{ marginBottom: layout.padding_x3 }}
          allowTruncation
        />
      )}
      ListHeaderComponentStyle={{ zIndex: 1 }}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={(post: PostResult) => post.identifier}
      onScroll={scrollHandler}
      contentContainerStyle={styles.content}
      onEndReachedThreshold={1}
      onEndReached={onEndReached}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.contentPadding,
    alignSelf: "center",
    maxWidth: NEWS_FEED_MAX_WIDTH,
    width: "100%",
  },
});
