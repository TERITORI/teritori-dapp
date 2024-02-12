import React, { FC } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";

import { PostsRequest } from "@/api/feed/v1/feed";
import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { FeedVideosList } from "@/components/video/FeedVideosList";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import {
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "@/utils/style/layout";
import { PostCategory } from "@/utils/types/feed";

export const VideosFeed: FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { width, height } = useMaxResolution();
  const isMobile = useIsMobile();
  return (
    <ScrollView style={{ height }}>
      {/* ScreenContainer in FeedScreen has noScroll, so we need to add MobileTitle here */}
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="videos" />
      <FeedVideosList
        allowUpload
        title="All videos"
        req={feedRequest}
        style={{
          alignSelf: "center",
          width: windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width,
          maxWidth: screenContentMaxWidth,
        }}
      />
    </ScrollView>
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
