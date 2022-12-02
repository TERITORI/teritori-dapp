import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { SocialThreadCard } from "../cards/SocialThreadCard";
import { PostInputBox } from "./PostInputBox";

export const NewsFeed: React.FC = () => {
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();

  const [posts, setPosts] = useState<PostResult[]>([]);

  async function initData() {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      walletAddress: wallet.address,
    });

    const mainPosts = await client.queryMainPosts({
      count: 10.0,
      from: 0,
      sort: "desc",
    });

    setPosts(mainPosts);
  }

  useFocusEffect(
    React.useCallback(() => {
      initData();
    }, [wallet?.address])
  );
  return (
    <View>
      <PostInputBox onPress={() => navigation.navigate("FeedNewPost")} />
      <View style={{ paddingTop: layout.contentPadding }}>
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
