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
import { UPPQuests } from "../../components/userPublicProfile/UPPSucceedQuests";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
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
  metadata: any;
  selectedTabItemLabel: string;
}> = ({ metadata, selectedTabItemLabel }) => {
  switch (selectedTabItemLabel) {
    case "Social Feed":
      return <UPPSocialFeed />;
    case "NFTs":
      return <UPPNFTs userAddress={metadata?.userAddress || ""} />;
    case "Activity":
      return <UPPActivity />;
    case "Succeed Quests":
      return <UPPQuests userAddress={metadata?.userAddress || ""} />;
    case "Pathwar Challenges":
      return <UPPPathwarChallenges />;
    case "Gig Services":
      return <UPPGigServices />;
    default:
      return null;
  }
};

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route,
}) => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);
  const { loading, metadata, notFound } = useTNSMetadata(route.params.id);

  const { setLoadingFullScreen } = useFeedbacks();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loading);
  }, [loading]);

  return (
    <ScreenContainer
      smallMargin
      headerChildren={
        <BrandText style={fontSemibold20}>
          {metadata?.public_name || ""}
        </BrandText>
      }
    >
      {notFound ? (
        <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
          <BrandText>User not found</BrandText>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
            <UPPIntro metadata={metadata} />

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

            <SelectedTabContent
              selectedTabItemLabel={selectedTabItem.label}
              metadata={metadata}
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
