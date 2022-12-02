import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { NewsFeed } from "../../components/NewsFeed/NewsFeed";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Tabs } from "../../components/tabs/Tabs";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { OPPIntro } from "./OPPIntro";

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

export const OrganizationPublicProfileScreen: ScreenFC<
  "OrganizationPublicProfile"
> = ({
  route: {
    params: { id },
  },
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("news");

  const { metadata, notFound } = useTNSMetadata(id.replace("tori-", ""));

  return (
    <ScreenContainer
      smallMargin
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>
          {metadata?.public_name || ""}
        </BrandText>
      }
    >
      {notFound || !id.startsWith("tori-") ? (
        <View
          style={{
            alignItems: "center",
            width: "100%",
            marginTop: layout.padding_x4,
          }}
        >
          <BrandText>User not found</BrandText>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
            <OPPIntro userId={id} metadata={metadata} />

            <Tabs
              items={screenTabItems}
              selected={selectedTab}
              onSelect={setSelectedTab}
              style={{
                marginTop: layout.padding_x4,
                height: 64,
              }}
              gradientText
            />

            <SelectedTabContent selectedTab={selectedTab} />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
