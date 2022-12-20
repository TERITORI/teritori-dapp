import React, { useState } from "react";

import { NewsFeed } from "../../components/NewsFeed/NewsFeed";
import { ScreenContainer } from "../../components/ScreenContainer";
import { screenTabItems } from "../../utils/feed";
import { ScreenFC } from "../../utils/navigation";
import { FeedHeader } from "./components/FeedHeader";

export interface SelectedTabContentProps {
  selectedTab: keyof typeof screenTabItems;
  Header: React.ComponentType;
}

const SelectedTabContent: React.FC<SelectedTabContentProps> = ({
  selectedTab,
  Header,
}) => {
  switch (selectedTab) {
    case "news":
      return <NewsFeed selectedTab={selectedTab} Header={Header} />;
    default:
      return null;
  }
};

export const FeedScreen: ScreenFC<"Feed"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("news");

  return (
    <ScreenContainer responsive footerChildren={<></>} fullWidth noScroll>
      <SelectedTabContent
        selectedTab={selectedTab}
        Header={() => (
          <FeedHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />
        )}
      />
    </ScreenContainer>
  );
};
