import React, { FC } from "react";

import { FeedHeader } from "./components/FeedHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MobileTitle } from "../../components/ScreenContainer/ScreenContainerMobile";
import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { FeedVideosList } from "../../components/video/FeedVideosList";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NetworkFeature } from "../../networks";

export const VideosFeedScreen: FC = () => {
  const isMobile = useIsMobile();
  return (
    <ScreenContainer
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      headerChildren={<BrandText>Social Feed</BrandText>}
    >
      {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
      {isMobile && <MobileTitle title="SOCIAL FEED" />}
      <FeedHeader selectedTab="videos" />
      <FeedVideosList allowUpload title="All videos" req={feedRequest} />
    </ScreenContainer>
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
