import React, { useState } from "react";
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
import useSelectedWallet from "../../hooks/useSelectedWallet";
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
  userId: string;
  selectedTab: keyof typeof screenTabItems;
}> = ({ userId, selectedTab }) => {
  switch (selectedTab) {
    case "social-feed":
      return <UPPSocialFeed />;
    case "nfts":
      return <UPPNFTs userId={userId} />;
    case "activity":
      return <UPPActivity />;
    case "quests":
      return <UPPQuests userId={userId} />;
    case "pathwar":
      return <UPPPathwarChallenges />;
    case "gig":
      return <UPPGigServices />;
    default:
      return null;
  }
};

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route: {
    params: { id },
  },
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("nfts");

  const requestedAddress = id.replace("tori-", "");
  const { metadata } = useTNSMetadata(requestedAddress);
  const selectedWallet = useSelectedWallet();

  return (
    <ScreenContainer
      isHeaderSmallMargin
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>{metadata?.tokenId || ""}</BrandText>
      }
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: screenContentMaxWidthLarge }}>
          <UPPIntro
            userId={id}
            metadata={metadata}
            isUserOwner={selectedWallet?.address === requestedAddress}
          />

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

          <SelectedTabContent selectedTab={selectedTab} userId={id} />
        </View>
      </View>
    </ScreenContainer>
  );
};
