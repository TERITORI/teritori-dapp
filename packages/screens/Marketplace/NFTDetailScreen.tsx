import { RouteProp } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { RootStackParamList } from "../../utils/navigation";
import {
  screenContainerContentMarginHorizontal,
  screenContentMaxWidth,
} from "../../utils/style/layout";

const screenTabItems: TabItem[] = [
  {
    label: "Main info",
    isSelected: true,
  },
  {
    label: "Price history",
    isSelected: false,
  },
  {
    label: "Offers",
    isSelected: false,
  },
  {
    label: "Activities",
    isSelected: false,
  },
  {
    label: "More from collection",
    isSelected: false,
  },
];

export const NFTDetailScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NFTDetail">;
}> = ({ route }) => {
  const { onPressTabItem, tabItems } = useTabs(screenTabItems);

  //TODO: Get collection mintaddress and name from the NFT and pass it to <BackTo/>

  return (
    <ScreenContainer
      noScroll
      noMargin
      headerChildren={
        <BackTo
          label="Collection name"
          navItem="Collection"
          navParams={{ mintAddress: "collection_mintaddress" }}
        />
      }
    >
      {/*TODO: Reuse this ScrollView pattern (ScrollView + View just bellow) in other Screens to provide a ScreenView (One per screen) width centered scrolling content with fixed max width. And remove it from ScreenContainer*/}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: screenContainerContentMarginHorizontal,
        }}
      >
        <View
          style={{
            alignItems: "center",
            width: "100%",
            maxWidth: screenContentMaxWidth,
          }}
        >
          {/*====== Tabs Menu for whole screen */}
          <Tabs
            items={tabItems}
            style={{ marginTop: 24, justifyContent: "flex-end" }}
            onPressTabItem={onPressTabItem}
          />

          {/*====== Main info NFT */}
          <NFTMainInfo />

          {/*====== More from this collection */}
          {/*TODO: Fetch 4 firsts NFTs from this NFT collection*/}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
