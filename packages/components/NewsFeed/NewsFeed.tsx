import React, { useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { combineFetchFeedPages, useFetchFeed } from "../../hooks/useFetchFeed";
import { SelectedTabContentProps } from "../../screens/Feed/FeedScreen";
import { layout } from "../../utils/style/layout";
import { RefreshButton } from "../RefreshButton";
import { TertiaryButton } from "../buttons/TertiaryButton";
import { SocialThreadCard } from "../cards/SocialThreadCard";
import { Footer } from "../footers/Footer";
import { NewsFeedInput } from "./NewsFeedInput";

const SCROLL_OFFSET_VALUE = 240;

export const NewsFeed: React.FC<SelectedTabContentProps> = ({ Header }) => {
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

  // returns

  const ListFooterComponent = useCallback(
    () => (
      <View>
        {!isLoading && hasNextPage ? (
          <TertiaryButton
            onPress={fetchNextPage}
            text="Load More"
            size="SM"
            style={{ alignSelf: "center", marginBottom: layout.padding_x1 }}
          />
        ) : null}
        <Footer />
      </View>
    ),
    [isLoading, posts.length]
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View>
        <Header />
        <NewsFeedInput type="post" onSubmitSuccess={refetch} />
        <Animated.View
          style={[{ paddingVertical: layout.padding_x1 }, animationStyle]}
        >
          <RefreshButton
            isRefreshing={isLoadingValue}
            onPress={refetch}
            title="Refresh feed"
            widthToAnimate={140}
          />
        </Animated.View>
      </View>
    ),
    [isLoadingValue, Header]
  );

  return (
    <>
      <Animated.FlatList
        scrollEventThrottle={0.1}
        data={posts as PostResult[]}
        renderItem={({ item: post, index }) => (
          <SocialThreadCard post={post} style={{ marginBottom: 74 }} />
        )}
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={(item: PostResult) => item.identifier}
        onScroll={scrollHandler}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.content}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.contentPadding,
  },
});
