import React from "react";
import { View } from "react-native";

import { JungleFeedScreen } from "./JungleFeedScreen";

import { PostsRequest } from "@/api/feed/v1/feed";
import { PostCategory } from "@/utils/types/feed";

type Props = object;

export const PictureFeedScreen = (props: Props) => {
  const feedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Picture],
      user: "",
      mentions: [],
      hashtags: [],
      premiumLevelMax: -1,

      premiumLevelMin: 0,
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
