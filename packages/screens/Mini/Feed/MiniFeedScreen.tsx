import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import JungleScreen from "./JungleScreen";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

const feedScreenTabItems = {
  jungle: {
    name: "Jungle",
    categories: [],
  },
  sounds: {
    name: "Sounds",
    categories: [PostCategory.MusicAudio],
  },
  pics: {
    name: "Pics",
    categories: [PostCategory.Picture],
  },
  videos: {
    name: "Videos",
    categories: [PostCategory.Video],
  },
  articles: {
    name: "Articles",
    categories: [PostCategory.Article],
  },
};

export const MiniFeedScreen: ScreenFC<"MiniFeeds"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof feedScreenTabItems>("jungle");

  const category = feedScreenTabItems[selectedTab].categories;
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
        <JungleScreen category={category} />
        {/* {selectedTab === "jungle" && <JungleScreen category={category} />} */}
      </View>
    </ScreenContainer>
  );
};
