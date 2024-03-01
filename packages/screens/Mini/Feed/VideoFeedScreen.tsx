import React from "react";
import { View } from "react-native";

import { PostsRequest } from "@/api/feed/v1/feed";
import { FeedVideosList } from "@/components/video/FeedVideosList";
import { PostCategory } from "@/utils/types/feed";

type Props = object;

export const VideoFeedScreen = (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <FeedVideosList title="All videos" req={feedRequest} allowUpload />
    </View>
  );
};

const feedRequest: Partial<PostsRequest> = {
  filter: {
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
