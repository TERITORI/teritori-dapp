import React, { useEffect } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { UPPActivity } from "../../components/userPublicProfile/UPPActivity";
import { UPPGigServices } from "../../components/userPublicProfile/UPPGigServices";
import { UPPIntro } from "../../components/userPublicProfile/UPPIntro";
import { UPPNFTs } from "../../components/userPublicProfile/UPPNFTs";
import { UPPPathwarChallenges } from "../../components/userPublicProfile/UPPPathwarChallenges";
import { UPPSocialFeed } from "../../components/userPublicProfile/UPPSocialFeed";
import { UPPSucceedQuests } from "../../components/userPublicProfile/UPPSucceedQuests";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useToken } from "../../hooks/tokens";
import { ScreenFC } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

const screenTabItems: TabItem[] = [
  {
    label: "Social Feed",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "NFTs",
    isSelected: true,
    isDisabled: false,
  },
  {
    label: "Activity",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "Succeed Quests",
    isSelected: false,
    isDisabled: false,
  },
  {
    label: "Pathwar Challenges",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "Gig Services",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "Governance Votes",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "Putted NFT to Rioters Footer",
    isSelected: false,
    isDisabled: true,
  },
  {
    label: "Shared servers",
    isSelected: false,
    isDisabled: true,
  },
];

const SelectedTabContent: React.FC<{
  selectedTabItemLabel: string;
}> = ({ selectedTabItemLabel }) => {
  switch (selectedTabItemLabel) {
    case "Social Feed":
      return <UPPSocialFeed />;
    case "NFTs":
      return <UPPNFTs />;
    case "Activity":
      return <UPPActivity />;
    case "Succeed Quests":
      return <UPPSucceedQuests />;
    case "Pathwar Challenges":
      return <UPPPathwarChallenges />;
    case "Gig Services":
      return <UPPGigServices />;
    default:
      return null;
  }
};

const Content: React.FC<{ id: string }> = React.memo(({ id }) => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);
  const { loadingToken, token, notFound } = useToken(id, process.env.TLD || "");

  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingToken);
  }, [loadingToken]);

  if (notFound) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
        <BrandText>User not found</BrandText>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
          <UPPIntro token={token} id={id} />

          <Tabs
            items={tabItems}
            onPressTabItem={onPressTabItem}
            style={{
              marginTop: 32,
              height: 32,
              marginBottom: layout.padding_x2_5 / 2,
            }}
            borderColorTabSelected={primaryColor}
          />

          <SelectedTabContent selectedTabItemLabel={selectedTabItem.label} />
        </View>
      </View>
    );
  }
});

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route,
}) => {
  return (
    <ScreenContainer
      smallMargin
      headerChildren={
        <BrandText style={fontSemibold20}>{route.params.id}</BrandText>
      }
    >
      <Content key={route.params.id} id={route.params.id} />
    </ScreenContainer>
  );
};
