import React, { FC } from "react";
import { useWindowDimensions } from "react-native";

import { FeedHeader } from "./FeedHeader";
import { PostsRequest } from "../../../api/feed/v1/feed";
import { MobileTitle } from "../../../components/ScreenContainer/ScreenContainerMobile";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { FeedVideosList } from "../../../components/video/FeedVideosList";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import {
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "../../../utils/style/layout";

export const VideosFeed: FC = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  return (
    <>
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
    </>
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
