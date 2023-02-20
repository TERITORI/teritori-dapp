import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../../hooks/useFetchFeed";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../../utils/style/layout";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { SocialThreadCard } from "../SocialThread/SocialThreadCard";
import { CreateShortPostButton } from "./CreateShortPost/CreateShortPostButton";
import { CreateShortPostButtonFloating } from "./CreateShortPost/CreateShortPostButtonFloating";
import { CreateShortPostModal } from "./CreateShortPost/CreateShortPostModal";
import { RefreshButton } from "./RefreshButton/RefreshButton";
import { RefreshButtonRound } from "./RefreshButton/RefreshButtonRound";

const OFFSET_Y_LIMIT_FLOATING = 140;

interface NewsFeedProps {
  Header: React.ComponentType;
  hash?: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ Header }) => {
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed();

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const posts: PostResult[] = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data]
  );
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      setFlatListContentOffsetY(event.contentOffset.y);
      if (flatListContentOffsetY > event.contentOffset.y) {
        isGoingUp.value = true;
      } else if (flatListContentOffsetY < event.contentOffset.y) {
        isGoingUp.value = false;
      }
      setFlatListContentOffsetY(event.contentOffset.y);
    },
  });

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
      <>
        <Header />
        <Animated.View
          style={[
            {
              paddingVertical: layout.padding_x1,
              flexDirection: "row",
              justifyContent: "center",
            },
          ]}
        >
          <CreateShortPostButton onPress={() => setCreateModalVisible(true)} />
          <SpacerRow size={2} />
          <RefreshButton isRefreshing={isLoadingValue} onPress={refetch} />
        </Animated.View>
        <SpacerColumn size={1.5} />
      </>
    ),
    [isLoadingValue, Header]
  );

  return (
    <>
      <Animated.FlatList
        scrollEventThrottle={0.1}
        data={posts}
        renderItem={({ item: post }) => (
          <>
            <SocialThreadCard post={post} allowTruncation />
            <SpacerColumn size={3} />
          </>
        )}
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={(post: PostResult) => post.identifier}
        onScroll={scrollHandler}
        contentContainerStyle={styles.content}
        onEndReachedThreshold={1}
        onEndReached={onEndReached}
      />

      {flatListContentOffsetY >= OFFSET_Y_LIMIT_FLOATING && (
        <View style={styles.floatingActions}>
          <CreateShortPostButtonFloating
            onPress={() => setCreateModalVisible(true)}
            style={{ marginBottom: layout.padding_x2 }}
          />

          <RefreshButtonRound isRefreshing={isLoadingValue} onPress={refetch} />
        </View>
      )}

      <CreateShortPostModal
        isVisible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    alignSelf: "center",
    maxWidth: NEWS_FEED_MAX_WIDTH,
    width: "100%",
  },
  floatingActions: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 68,
    bottom: 68,
  },
});
