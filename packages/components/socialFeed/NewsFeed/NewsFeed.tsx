import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  combineFetchFeedPages,
  FeedRequest,
  useFetchFeed,
} from "../../../hooks/useFetchFeed";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useTNSMetadata } from "../../../hooks/useTNSMetadata";
import { useAppNavigation } from "../../../utils/navigation";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../../utils/style/layout";
import { SpacerColumn } from "../../spacer";
import { SocialThreadCard } from "../SocialThread/SocialThreadCard";
import { CreateShortPostButtonRound } from "./CreateShortPost/CreateShortPostButtonRound";
import { CreateShortPostModal } from "./CreateShortPost/CreateShortPostModal";
import { NewPostFormValues } from "./NewsFeed.type";
import { NewsFeedInput } from "./NewsFeedInput";
import { RefreshButton } from "./RefreshButton/RefreshButton";
import { RefreshButtonRound } from "./RefreshButton/RefreshButtonRound";

const OFFSET_Y_LIMIT_FLOATING = 224;

interface NewsFeedProps {
  Header: React.ComponentType;
  req?: FeedRequest;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ Header, req = {} }) => {
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(req);
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const posts: PostResult[] = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data]
  );
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { metadata } = useTNSMetadata(req.user);

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

  const onPressCreateArticle = (formValues: NewPostFormValues) => {
    navigation.navigate("FeedNewPost", formValues);
  };

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  // If we are on the PublicProfileScreen of a user, he will be automatically mentioned in the written post
  // (Except if it's the connected user's PublicProfileScreen)
  const mentionedUser = useMemo(() => {
    if (selectedWallet?.address !== req.user) {
      return metadata?.public_name || req.user;
    }
  }, [selectedWallet?.address, req.user, metadata?.public_name]);

  const ListHeaderComponent = useCallback(
    () => (
      <>
        <View onLayout={onHeaderLayout}>
          <Header />
        </View>
        <SpacerColumn size={2.5} />
        <Animated.View
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <NewsFeedInput
            onPressCreateArticle={onPressCreateArticle}
            type="post"
            onSubmitSuccess={refetch}
            style={{ width: "100%", maxWidth: NEWS_FEED_MAX_WIDTH }}
            mentionedUser={mentionedUser}
            // If we are on a HashFeedScreen, the corresponding hash will be automatically added in the written post
            hash={req.hash}
          />
          <SpacerColumn size={1.5} />
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

      {flatListContentOffsetY >= OFFSET_Y_LIMIT_FLOATING + headerHeight && (
        <View style={styles.floatingActions}>
          <CreateShortPostButtonRound
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
