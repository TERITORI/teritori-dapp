import React, { useState } from "react";
import { Image, View } from "react-native";

import { LeaderboardMarketplaceTable } from "./component/LeaderboardMarketplaceTable";
import LeaderboardBannerImage from "../../../assets/banners/LeaderboardBanner.png";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

import { Tabs } from "@/components/tabs/Tabs";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";

type TabsListType = "teritori" | "ethereum";

const dummyData = {
  rank: 1,
  trader: "ferryman.tori",
  totalXp: "1340",
  bonus: "X2",
  listingXp: "150",
  salesXp: 250,
  buyXp: "2270",
};

export const LeaderboardMarketplaceScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useMaxResolution();
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState<TabsListType>("teritori");

  const tabs = {
    teritori: {
      name: "Teritori",
    },
    ethereum: {
      name: "Ethereum",
    },
  };

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>NFT Traders Leaderboard</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
    >
      <View style={{ marginTop: layout.spacing_x4 }}>
        <Image
          source={LeaderboardBannerImage}
          style={{ width: "100%", height: width / 2.5 }}
        />

        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: layout.spacing_x3,
          }}
        >
          <BrandText style={fontSemibold28}>NFT Traders Leaderboard</BrandText>
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 32 }}
            onSelect={setSelectedTab}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 12,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            marginTop: layout.spacing_x4,
          }}
        >
          <LeaderboardMarketplaceTable rows={Array(5).fill(dummyData)} />
        </View>
      </View>
    </ScreenContainer>
  );
};
