import React from "react";
import { View } from "react-native";

import { JungleFeedScreen } from "./JungleFeedScreen";

import { PostsRequest } from "@/api/feed/v1/feed";
import { PostCategory } from "@/utils/types/feed";

export const ArticlesFeedScreen = () => {
  const feedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Article],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };

  return (
    <View style={{ flex: 1 }}>
      <JungleFeedScreen req={feedRequest} />
    </View>
  );
};
