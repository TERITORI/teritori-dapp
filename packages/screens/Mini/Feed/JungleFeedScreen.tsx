import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { MiniSocialArticle } from "./components/MiniSocialArticle";
import { MiniThread } from "./components/MiniThread";
import { MiniVideo } from "./components/MiniVideo";
import { Spinner } from "./components/Spinner";
import { Post, PostsRequest } from "../../../api/feed/v1/feed";
import { Separator } from "../../../components/separators/Separator";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../components/spacer";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../../hooks/feed/useFetchFeed";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { layout } from "../../../utils/style/layout";

type Props = {
  req: Partial<PostsRequest>;
};
export const JungleFeedScreen = ({ req }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const selectedWallet = useSelectedWallet();

  const reqWithQueryUser = { ...req, queryUserId: selectedWallet?.userId };
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(reqWithQueryUser);

  const combinedPosts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data],
  );

  const RenderItem = useCallback(
    (post: Post) => {
      return (
        <View
          style={{
            width: "100%",
          }}
        >
          {post.category === PostCategory.Article ? (
            <MiniSocialArticle post={post} refetchFeed={refetch} />
          ) : post.category === PostCategory.Video ? (
            <MiniVideo post={post} refetchFeed={refetch} />
          ) : (
            <MiniThread post={post} refetchFeed={refetch} isPreview />
          )}
          <Separator style={{ marginVertical: layout.spacing_x3 }} />
        </View>
      );
    },
    [refetch],
  );
  const onEndReached = () => {
    setIsRefreshing(false);
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const onRefreshing = () => {
    setIsRefreshing(true);
    refetch();
  };

  return (
    <View style={{ flex: 1 }}>
      {isFetching && isRefreshing && (
        <>
          <View
            style={{
              alignItems: "center",
              marginVertical: layout.spacing_x1_5,
            }}
          >
            <Spinner />
          </View>
          <SpacerColumn size={2} />
        </>
      )}
      <Animated.FlatList
        data={combinedPosts}
        renderItem={({ item: post }) => RenderItem(post)}
        ListHeaderComponentStyle={{
          zIndex: 1,
        }}
        keyExtractor={(post: Post, idx: number) => `${post.identifier}-${idx}`}
        onEndReachedThreshold={4}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={onRefreshing}
      />
      {isFetching && !isRefreshing && (
        <View
          style={{ alignItems: "center", marginVertical: layout.spacing_x1_5 }}
        >
          <Spinner />
        </View>
      )}
    </View>
  );
};
