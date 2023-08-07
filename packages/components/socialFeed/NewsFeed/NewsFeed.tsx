import MasonryList from "@react-native-seoul/masonry-list";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  Suspense,
  useState,
} from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { CreateShortPostButton } from "./CreateShortPost/CreateShortPostButton";
import { CreateShortPostButtonRound } from "./CreateShortPost/CreateShortPostButtonRound";
import { CreateShortPostModal } from "./CreateShortPost/CreateShortPostModal";
import { NewsFeedInput } from "./NewsFeedInput";
import { RefreshButton } from "./RefreshButton/RefreshButton";
import { RefreshButtonRound } from "./RefreshButton/RefreshButtonRound";
import { Post, PostsRequest } from "../../../api/feed/v1/feed";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../../hooks/feed/useFetchFeed";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { usePrevious } from "../../../hooks/usePrevious";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { SocialThreadCard } from "../SocialThread/SocialThreadCard";

const OFFSET_Y_LIMIT_FLOATING = 224;
export const ROUND_BUTTON_WIDTH_L = 60;
export const ROUND_BUTTON_WIDTH_S = 42;

interface NewsFeedProps {
  Header: React.ComponentType;
  req: PostsRequest;
  // Receive this if the post is created from HashFeedScreen
  additionalHashtag?: string;
  // Receive this if the post is created from UserPublicProfileScreen (If the user doesn't own the UPP)
  additionalMention?: string;
  daoId?: string;
  disablePosting?: boolean;
}

const halfGap = layout.padding_x1;

const maxElemWidth = 400;

const keyExtractor = (post: Post) => post.identifier;

const listStyle: ViewStyle = { width: "100%", marginTop: 32 };
const contentContainerStyle: ViewStyle = { width: "100%", margin: -halfGap };

export const NewsFeed: React.FC<NewsFeedProps> = ({
  Header,
  req,
  additionalHashtag,
  additionalMention,
  daoId,
  disablePosting,
}) => {
  const isMobile = useIsMobile();
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(req);
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const posts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data]
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / maxElemWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * elemsPerRow * 2) / elemsPerRow
    : posts.length || 0;
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

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
  }, [isFetching, isLoading, isGoingUp, isLoadingValue]);

  const onEndReached = useCallback(() => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching, isLoading]);

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const ListHeaderComponent = useCallback(
    () => (
      <>
        <View
          onLayout={onHeaderLayout}
          style={{ width: "100%", alignSelf: "center", alignItems: "center" }}
        >
          <Header />
        </View>
        {!disablePosting && (
          <View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isMobile ? "row" : "column",
                width: "100%",
              },
            ]}
          >
            {isMobile ? (
              <>
                <CreateShortPostButton
                  label="Create Post"
                  onPress={() => setCreateModalVisible(true)}
                />
                <SpacerRow size={1.5} />
              </>
            ) : (
              <>
                <NewsFeedInput
                  daoId={daoId}
                  type="post"
                  onSubmitSuccess={refetch}
                  additionalMention={additionalMention}
                  additionalHashtag={additionalHashtag}
                />
                <SpacerColumn size={1.5} />
              </>
            )}
            <RefreshButton isRefreshing={isLoadingValue} onPress={refetch} />
          </View>
        )}
        <SpacerColumn size={1.5} />
      </>
    ),
    [
      Header,
      additionalHashtag,
      additionalMention,
      daoId,
      disablePosting,
      isLoadingValue,
      isMobile,
      refetch,
    ]
  );

  const styles = StyleSheet.create({
    floatingActions: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      right: 24,
      bottom: 32,
    },
  });

  const render = useCallback(
    ({ item: post }: { item: unknown; i: number }) => (
      <View style={{ width: elemSize, margin: halfGap }}>
        <SocialThreadCard post={post as Post} isPreview />
      </View>
    ),
    [elemSize]
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width),
    []
  );

  const [resizing, setResizing] = useState(false);
  const prevContainerWidth = usePrevious(containerWidth);
  useLayoutEffect(() => {
    if (
      containerWidth !== prevContainerWidth &&
      prevContainerWidth !== 0 &&
      containerWidth !== 0 &&
      !resizing
    ) {
      setResizing(true);
      setTimeout(() => setResizing(false), 500);
    }
  }, [containerWidth, prevContainerWidth, resizing]);

  /*
  if (resizing) {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 32,
          borderRadius: 8,
          width: "100%",
          borderWidth: 1,
          borderColor: neutral77,
          backgroundColor: neutral33,
        }}
      />
    );
  }
  */

  return (
    <View style={{ width: "100%", flex: 1 }} onLayout={handleLayout}>
      <MasonryList
        // don't put a scroll handler it will ruin perfs
        key={`news-feed-list-x${elemsPerRow}`}
        numColumns={elemsPerRow}
        data={posts}
        refreshing
        renderItem={render}
        style={listStyle}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={keyExtractor}
        // onScroll={scrollHandler}
        contentContainerStyle={contentContainerStyle}
        onEndReachedThreshold={1.5}
        onEndReached={onEndReached}
        removeClippedSubviews
      />

      {flatListContentOffsetY >= OFFSET_Y_LIMIT_FLOATING + headerHeight && (
        <View style={styles.floatingActions}>
          <CreateShortPostButtonRound
            onPress={() => setCreateModalVisible(true)}
            style={{ marginBottom: layout.padding_x1_5 }}
          />

          <RefreshButtonRound isRefreshing={isLoadingValue} onPress={refetch} />
        </View>
      )}

      <CreateShortPostModal
        daoId={daoId}
        isVisible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        additionalMention={additionalMention}
        additionalHashtag={additionalHashtag}
        onSubmitSuccess={refetch}
      />
    </View>
  );
};
