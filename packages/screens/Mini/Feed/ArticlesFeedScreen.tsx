import React, { useMemo } from "react";
import { View } from "react-native";

import { JungleFeedScreen } from "./JungleFeedScreen";

import { PostsRequest } from "@/api/feed/v1/feed";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { PostCategory } from "@/utils/types/feed";

export const ArticlesFeedScreen = () => {
  const selectedNetworkId = useSelectedNetworkId();

  const feedRequest = useMemo(() => {
    const req: Partial<PostsRequest> = {
      filter: {
        networkId: selectedNetworkId,
        categories: [PostCategory.Article],
        user: "",
        mentions: [],
        hashtags: [],
        premiumLevelMin: 0,
        premiumLevelMax: -1,
      },
      limit: 10,
      offset: 0,
    };
    return req;
  }, [selectedNetworkId]);

  return (
    <View style={{ flex: 1 }}>
      <JungleFeedScreen req={feedRequest} />
    </View>
  );
};
