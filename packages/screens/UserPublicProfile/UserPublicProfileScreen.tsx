import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { ProfileIntro } from "../../components/userPublicProfile/ProfileIntro";
import { ScreenFC } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { screenContentMaxWidthLarge } from "../../utils/style/layout";

const screenTabItems: TabItem[] = [
  {
    label: "Social Feed",
    isSelected: true,
  },
  {
    label: "NFTs",
    isSelected: false,
  },
  {
    label: "Activity",
    isSelected: false,
  },
  {
    label: "Succeed Quests",
    isSelected: false,
  },
  {
    label: "Pathwar Challenges",
    isSelected: false,
  },
  {
    label: "Gig Services",
    isSelected: false,
  },
  {
    label: "Governance Votes",
    isSelected: false,
  },
  {
    label: "Putted NFT to Rioters Footer",
    isSelected: false,
  },
  {
    label: "Shared servers",
    isSelected: false,
  },
];

const SelectedTabContent: React.FC<{
  selectedTabItemLabel: string;
}> = ({ selectedTabItemLabel }) => {
  switch (selectedTabItemLabel) {
    case "Social Feed":
      return <BrandText>aaaa</BrandText>;
    case "NFTs":
      return <BrandText>bbbb</BrandText>;
    case "Activity":
      return <BrandText>cccc</BrandText>;
    case "Succeed Quests":
      return <BrandText>dddd</BrandText>;
    case "Pathwar Challenges":
      return <BrandText>eeee</BrandText>;
    case "Gig Services":
      return <BrandText>ffff</BrandText>;
    case "Governance Votes":
      return <BrandText>gggg</BrandText>;
    case "Putted NFT to Rioters Footer":
      return <BrandText>hhhh</BrandText>;
    case "Shared servers":
      return <BrandText>iiii</BrandText>;
    default:
      return null;
  }
};

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = () => {
  // route.params.id
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);

  return (
    <ScreenContainer smallMargin>
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
          <ProfileIntro />

          <Tabs
            items={tabItems}
            onPressTabItem={onPressTabItem}
            style={{ marginTop: 32, height: 32 }}
            borderColorTabSelected={primaryColor}
          />

          <SelectedTabContent selectedTabItemLabel={selectedTabItem.label} />
        </View>
      </View>
    </ScreenContainer>
  );
};
