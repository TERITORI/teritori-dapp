import React, { FC } from "react";
import { View } from "react-native";

import { PostsRequest } from "@/api/feed/v1/feed";
import { FeedVideosList } from "@/components/video/FeedVideosList";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { PostCategory } from "@/utils/types/feed";

export const VideoFeedScreen: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();

  const feedRequest: Partial<PostsRequest> = {
    filter: {
      networkId: selectedNetworkId,
      categories: [PostCategory.Video],
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
      <FeedVideosList title="All videos" req={feedRequest} allowUpload />
    </View>
  );
};
