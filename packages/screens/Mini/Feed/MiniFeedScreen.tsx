import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { JungleFeedScreen } from "./JungleFeedScreen";
import { SoundFeedScreen } from "./SoundFeedScreen";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

const feedScreenTabItems = {
  jungle: {
    name: "Jungle",
  },
  sounds: {
    name: "Sounds",
  },
  pics: {
    name: "Pics",
  },
  videos: {
    name: "Videos",
  },
  articles: {
    name: "Articles",
  },
};

export const MiniFeedScreen: ScreenFC<"MiniFeeds"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof feedScreenTabItems>("jungle");

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Feeds"
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <RoundedTabs
          items={feedScreenTabItems}
          onSelect={(key) => setSelectedTab(key)}
          selected={selectedTab}
          style={{
            maxHeight: 36,
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x0_5,
          }}
        />
        {selectedTab === "jungle" && <JungleFeedScreen />}
        {selectedTab === "sounds" && <SoundFeedScreen />}
      </View>
    </ScreenContainer>
  );
};
