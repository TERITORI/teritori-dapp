import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
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
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../../utils/style/layout";
import { PostCategory } from "../../../utils/types/feed";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { SocialArticleCard } from "../SocialCard/cards/SocialArticleCard";
import { SocialThreadCard } from "../SocialCard/cards/SocialThreadCard";
import { SocialVideoCard } from "../SocialCard/cards/SocialVideoCard";

import { useAppMode } from "@/hooks/useAppMode";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { DeepPartial } from "@/utils/typescript";

const OFFSET_Y_LIMIT_FLOATING = 224;

interface NewsFeedProps {
  Header: React.ComponentType;
  req: DeepPartial<PostsRequest>;
  // Receive this if the post is created from HashFeedScreen
  additionalHashtag?: string;
  // Receive this if the post is created from UserPublicProfileScreen (If the user doesn't own the UPP)
  additionalMention?: string;
  daoId?: string;
  disablePosting?: boolean;
  isFlagged?: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  Header,
  req,
  additionalHashtag,
  additionalMention,
  daoId,
  disablePosting,
  isFlagged,
}) => {
  const isMobile = useIsMobile();
  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution({ isLarge: true });
  const selectedWallet = useSelectedWallet();
  const reqWithQueryUser = { ...req, queryUserId: selectedWallet?.userId };
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(reqWithQueryUser);
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const posts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data],
  );

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      runOnJS(setFlatListContentOffsetY)(event.contentOffset.y);
      if (flatListContentOffsetY > event.contentOffset.y) {
        isGoingUp.value = true;
      } else if (flatListContentOffsetY < event.contentOffset.y) {
        isGoingUp.value = false;
      }
      runOnJS(setFlatListContentOffsetY)(event.contentOffset.y);
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

  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const ListHeaderComponent = useCallback(
    () => (
      <>
        {!disablePosting && (
          <Animated.View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isMobile ? "row" : "column",
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
          </Animated.View>
        )}
        <SpacerColumn size={1.5} />
      </>
    ),
    [
      additionalHashtag,
      additionalMention,
      daoId,
      disablePosting,
      isLoadingValue,
      isMobile,
      refetch,
    ],
  );

  const mobileMode = windowWidth < RESPONSIVE_BREAKPOINT_S;
  const cardStyle = useMemo(() => {
    return (
      mobileMode && {
        borderRadius: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }
    );
  }, [mobileMode]);

  const RenderItem = useCallback(
    (post: Post) => {
      // NOTE: if you edit this, make sure that this is not too CPU expensive
      // Heavy components like SocialThreadCard, SocialArticleCard, etc. should be properly memoized
      return (
        <View>
          {post.category === PostCategory.Article ? (
            <SocialArticleCard
              post={post}
              style={cardStyle}
              refetchFeed={refetch}
            />
          ) : post.category === PostCategory.Video ? (
            <SocialVideoCard
              post={post}
              style={cardStyle}
              refetchFeed={refetch}
            />
          ) : (
            <SocialThreadCard
              post={post}
              refetchFeed={refetch}
              isPreview
              isFlagged={isFlagged}
              style={cardStyle}
            />
          )}
          <SpacerColumn size={2} />
        </View>
      );
    },
    [isFlagged, refetch, cardStyle],
  );

  // We have to keep the first fragment here to don't have a loop of re-renders
  return (
    <>
      <Animated.FlatList
        data={posts}
        renderItem={({ item: post }) => RenderItem(post)}
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <>
            <View
              onLayout={onHeaderLayout}
              style={{
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <Header />
            </View>
            <ListHeaderComponent />
          </>
        }
        keyExtractor={(post) => post.id}
        onScroll={scrollHandler}
        contentContainerStyle={{
          ...contentCStyle,
          width: isMobile ? "100%" : width,
        }}
        onEndReachedThreshold={4}
        onEndReached={onEndReached}
      />

      {flatListContentOffsetY >= OFFSET_Y_LIMIT_FLOATING + headerHeight && (
        <View style={floatingActionsCStyle}>
          <CreateShortPostButtonRound
            onPress={() => setCreateModalVisible(true)}
            style={{ marginBottom: layout.spacing_x1_5 }}
          />

          <RefreshButtonRound isRefreshing={isLoadingValue} onPress={refetch} />
        </View>
      )}

      <CreateShortPostModal
        label="Create a Post"
        daoId={daoId}
        isVisible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        additionalMention={additionalMention}
        additionalHashtag={additionalHashtag}
        onSubmitSuccess={refetch}
      />
    </>
  );
};

const contentCStyle: ViewStyle = {
  alignSelf: "center",
};
const floatingActionsCStyle: ViewStyle = {
  position: "absolute",
  justifyContent: "center",
  alignItems: "center",
  right: 24,
  bottom: 32,
};
