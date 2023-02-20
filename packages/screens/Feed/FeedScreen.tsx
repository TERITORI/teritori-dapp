import React, { useState } from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { screenTabItems } from "../../utils/feed";
import { ScreenFC } from "../../utils/navigation";
import { FeedHeader } from "./components/FeedHeader";

export interface SelectedTabContentProps {
  selectedTab?: keyof typeof screenTabItems;
  Header: React.ComponentType;
}

export const socialFeedBreakpointXL = 1024;
export const socialFeedBreakpointSM = 926;
export const socialFeedBreakpointXS = 0;

//TODO: Row scroll horizontally on mobile. Or dropdown menu
const SelectedTabContent: React.FC<SelectedTabContentProps> = ({
  selectedTab,
  Header,
}) => {
  switch (selectedTab) {
    case "news":
      return <NewsFeed Header={Header} />;
    default:
      return <NewsFeed Header={Header} />;
  }
};

export const FeedScreen: ScreenFC<"Feed"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("news");

  return (
    <ScreenContainer responsive fullWidth noScroll footerChildren={<></>}>
      <SelectedTabContent
        selectedTab={selectedTab}
        Header={() => (
          <FeedHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
        )}
      />
    </ScreenContainer>
  );
};
