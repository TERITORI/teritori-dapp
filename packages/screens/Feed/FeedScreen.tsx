import React, { useMemo, useState } from "react";

import { PostsRequest } from "../../api/feed/v1/feed";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { NetworkKind } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { feedTabToCategories, feedsTabItems } from "../../utils/social-feed";
import { FeedHeader } from "./components/FeedHeader";

export const socialFeedBreakpointXL = 1024;
export const socialFeedBreakpointSM = 926;
export const socialFeedBreakpointXS = 0;

export const FeedScreen: ScreenFC<"Feed"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof feedsTabItems>("all");

  const feedRequest: PostsRequest = useMemo(() => {
    return {
      filter: {
        categories: feedTabToCategories(selectedTab),
        user: "",
        mentions: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [selectedTab]);

  return (
    <ScreenContainer
      responsive
      fullWidth
      noScroll
      footerChildren={<></>}
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <NewsFeed
        req={feedRequest}
        Header={() => (
          <FeedHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
        )}
      />
    </ScreenContainer>
  );
};
