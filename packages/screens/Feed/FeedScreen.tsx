import React, { useMemo, useState } from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { FeedRequest } from "../../hooks/useFetchFeed";
import { feedTabToCategories, screenTabItems } from "../../utils/feed";
import { ScreenFC } from "../../utils/navigation";
import { FeedHeader } from "./components/FeedHeader";

export const socialFeedBreakpointXL = 1024;
export const socialFeedBreakpointSM = 926;
export const socialFeedBreakpointXS = 0;

export const FeedScreen: ScreenFC<"Feed"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("all");

  const feedRequest: FeedRequest = useMemo(() => {
    return {
      categories: feedTabToCategories(selectedTab),
    };
  }, [selectedTab]);

  return (
    <ScreenContainer responsive fullWidth noScroll footerChildren={<></>}>
      <NewsFeed
        req={feedRequest}
        Header={() => (
          <FeedHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
        )}
      />
    </ScreenContainer>
  );
};
