import React, { useState } from "react";
import { View } from "react-native";

import { NewsFeed } from "../../components/NewsFeed/NewsFeed";
import { ScreenContainer } from "../../components/ScreenContainer";
import { AvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { screenContentMaxWidthLarge } from "../../utils/style/layout";

const screenTabItems = {
  news: {
    name: "News Feed",
  },
  marketPlaceProfile: {
    name: "Marketplace's Profile",
    disabled: true,
  },
  bounties: {
    name: "Open Bounties & Jobs",
    disabled: true,
  },
  governance: {
    name: "Governance",
    disabled: true,
  },
  dao: {
    name: "Candidate to the DAO",
    disabled: true,
  },
  chat: {
    name: "Chat",
    disabled: true,
  },
};

const SelectedTabContent: React.FC<{
  selectedTab: keyof typeof screenTabItems;
}> = ({ selectedTab }) => {
  switch (selectedTab) {
    case "news":
      return <NewsFeed />;
    default:
      return null;
  }
};

export const FeedScreen: ScreenFC<"Feed"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("news");

  return (
    <ScreenContainer responsive footerChildren>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
          <AvatarWithFrame size={77.5} image={null} />
          <Tabs
            items={screenTabItems}
            selected={selectedTab}
            onSelect={setSelectedTab}
            style={{
              marginTop: 32,
              height: 64,
            }}
            borderColorTabSelected={primaryColor}
            gradientText
            textStyle={fontSemibold20}
          />
          <SelectedTabContent selectedTab={selectedTab} />
        </View>
      </View>
    </ScreenContainer>
  );
};
