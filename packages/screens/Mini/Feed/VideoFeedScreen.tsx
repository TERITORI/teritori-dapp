import React from "react";
import { View } from "react-native";

import { PostsRequest } from "../../../api/feed/v1/feed";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { FeedVideosList } from "../../../components/video/FeedVideosList";

type Props = object;

export const VideoFeedScreen = (props: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <FeedVideosList title="All videos" req={feedRequest} />
    </View>
  );
};

const feedRequest: Partial<PostsRequest> = {
  filter: {
    categories: [PostCategory.Video],
    user: "",
    mentions: [],
    hashtags: [],
  },
  limit: 10,
  offset: 0,
};
