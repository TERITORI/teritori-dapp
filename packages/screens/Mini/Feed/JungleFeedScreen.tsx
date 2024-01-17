import { useCallback, useMemo } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { MiniSocialArticle } from "./components/MiniSocialArticle";
import { MiniThread } from "./components/MiniThread";
import { MiniVideo } from "./components/MiniVideo";
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

export const JungleFeedScreen = () => {
  const selectedWallet = useSelectedWallet();

  const req: Partial<PostsRequest> = {
    filter: undefined,
    limit: 10,
    offset: 1,
    queryUserId: selectedWallet?.userId,
  };
  const reqWithQueryUser = { ...req, queryUserId: selectedWallet?.userId };
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(reqWithQueryUser);

  const combinedPosts = useMemo(
    () => (data ? combineFetchFeedPages(data.pages) : []),
    [data],
  );

  const RenderItem = useCallback(
    (post: Post) => {
      // NOTE: if you edit this, make sure that this is not too CPU expensive
      // Heavy components like SocialThreadCard, SocialArticleCard, etc. should be properly memoized
      return (
        <View
          style={{
            width: "100%",
          }}
        >
          {post.category === PostCategory.Article ? (
            // <SocialArticleCard
            //   post={post}
            //   style={cardStyle}
            //   refetchFeed={refetch}
            // />
            <MiniSocialArticle post={post} />
          ) : post.category === PostCategory.Video ? (
            <>
              <MiniVideo post={post} refetchFeed={refetch} />
              {/* <SocialVideoCard
              post={post}
              style={cardStyle}
              refetchFeed={refetch}
            /> */}
            </>
          ) : (
            <MiniThread post={post} refetchFeed={refetch} />
            // <SocialThreadCard
            //   post={post}
            //   refetchFeed={refetch}
            //   isPreview
            //   isFlagged={isFlagged}
            //   style={cardStyle}
            // />
          )}
          <Separator style={{ marginVertical: layout.spacing_x3 }} />
        </View>
      );
    },
    [refetch],
  );
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SpacerColumn size={2} />
      <Animated.FlatList
        scrollEnabled
        data={combinedPosts}
        renderItem={({ item: post }) => RenderItem(post)}
        ListHeaderComponentStyle={{
          zIndex: 1,
        }}
        keyExtractor={(post: Post, idx: number) => `${post.identifier}-${idx}`}
        onEndReachedThreshold={4}
        onEndReached={onEndReached}
      />
    </View>
  );
};
