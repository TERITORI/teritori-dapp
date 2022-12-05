import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, View, FlatList } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { TertiaryButton } from "../buttons/TertiaryButton";
import { SocialThreadCard } from "../cards/SocialThreadCard";
import { NewsFeedInput } from "./NewsFeedInput";

export const NewsFeed: React.FC = () => {
  const wallet = useSelectedWallet();

  const [posts, setPosts] = useState<PostResult[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async ({
    count = 10,
    from = 0,
    sort = "desc",
    isMore,
  }: {
    count?: number;
    from?: number;
    sort?: string;
    isMore?: boolean;
  } = {}) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    try {
      setLoading(true);
      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });

      const mainPosts = await client.queryMainPosts({
        count,
        from,
        sort,
      });

      setPosts((prev) => (isMore ? [...prev, ...mainPosts] : mainPosts));

      const mainPostCount = await client.queryMainPostsCount();
      setPostCount(mainPostCount);
    } catch (err) {
      console.log("initData err", err);
    }

    setLoading(false);
  };

  const fetchMore = () => {
    fetchData({
      from: posts.length,
      isMore: true,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [wallet?.address])
  );
  return (
    <View>
      <NewsFeedInput type="post" onSubmitSuccess={fetchData} />
      <View style={{ paddingTop: layout.contentPadding }}>
        {loading && (
          <ActivityIndicator
            color={secondaryColor}
            size="large"
            style={{
              marginVertical: layout.padding_x3,
            }}
          />
        )}

        <FlatList
          data={posts}
          renderItem={({ item: post }: { item: PostResult }) => (
            <SocialThreadCard post={post} style={{ marginBottom: 74 }} />
          )}
          keyExtractor={(item: PostResult) => item.identifier}
        />
        {!loading && posts.length < postCount && (
          <TertiaryButton
            onPress={fetchMore}
            text="Load More"
            size="SM"
            style={{ alignSelf: "center", marginBottom: layout.padding_x1 }}
          />
        )}
      </View>
    </View>
  );
};
