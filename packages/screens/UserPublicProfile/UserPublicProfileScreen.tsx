import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Tabs } from "../../components/tabs/Tabs";
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

const screenTabItems = {
  "social-feed": {
    name: "Social Feed",
    disabled: true,
  },
  nfts: {
    name: "NFTs",
  },
  activity: {
    name: "Activity",
    disabled: true,
  },
  quests: {
    name: "Quests",
  },
  pathwar: {
    name: "Pathwar Challenges",
    disabled: true,
  },
  gig: {
    name: "Gig Services",
    disabled: true,
  },
  votes: {
    name: "Governance Votes",
    disabled: true,
  },
  footer: {
    name: "Putted NFT to Rioters Footer",
    disabled: true,
  },
  servers: {
    name: "Shared servers",
    disabled: true,
  },
};

const SelectedTabContent: React.FC<{
  metadata: any;
  selectedTab: keyof typeof screenTabItems;
}> = ({ metadata, selectedTab }) => {
  switch (selectedTab) {
    case "social-feed":
      return <UPPSocialFeed />;
    case "nfts":
      return <UPPNFTs userId={metadata?.userId || ""} />;
    case "activity":
      return <UPPActivity />;
    case "quests":
      return <UPPQuests userId={metadata?.userId || ""} />;
    case "pathwar":
      return <UPPPathwarChallenges />;
    case "gig":
      return <UPPGigServices />;
    default:
      return null;
  }
};

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("nfts");
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
              items={screenTabItems}
              selected={selectedTab}
              onSelect={setSelectedTab}
              style={{
                marginTop: 32,
                height: 32,
                marginBottom: layout.padding_x2_5 / 2,
              }}
              borderColorTabSelected={primaryColor}
            />

            <SelectedTabContent selectedTab={selectedTab} metadata={metadata} />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
