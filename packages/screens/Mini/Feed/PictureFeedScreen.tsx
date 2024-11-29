import React, { FC } from "react";
import { View } from "react-native";

import { JungleFeedScreen } from "./JungleFeedScreen";

import { PostsRequest } from "@/api/feed/v1/feed";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { PostCategory } from "@/utils/types/feed";

export const PictureFeedScreen: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const feedRequest: Partial<PostsRequest> = {
    filter: {
      networkId: selectedNetworkId,
      categories: [PostCategory.Picture],
      user: "",
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
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
