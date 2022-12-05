import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SocialThreadCard } from "../cards/SocialThreadCard";
import { NewsFeedInput } from "./NewsFeedInput";

export const NewsFeed: React.FC = () => {
  const wallet = useSelectedWallet();

  const [posts, setPosts] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function initData() {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    try {
      setLoading(true);
      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });

      const mainPosts = await client.queryMainPosts({
        count: 10.0,
        from: 0,
        sort: "desc",
      });

      setPosts(mainPosts);
    } catch (err) {
      console.log("initData err", err);
    }

    setLoading(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      initData();
    }, [wallet?.address])
  );
  return (
    <View>
      <NewsFeedInput type="post" />
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
        {posts.map((post) => (
          <SocialThreadCard
            key={post.identifier}
            post={post}
            style={{ marginBottom: 74 }}
          />
        ))}
      </View>
    </View>
  );
};
