import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { LeaderboardMarketplaceTable } from "./component/LeaderboardMarketplaceTable";
import LeaderboardBannerImage from "../../../assets/banners/LeaderboardBanner.png";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

import { OptimizedImage } from "@/components/OptimizedImage";
import { Tabs } from "@/components/tabs/Tabs";
import { useIsMobile } from "@/hooks/useIsMobile";

type TabsListType = "teritori" | "ethereum";

export const LeaderboardMarketplaceScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
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
      <View>
        <OptimizedImage
          width={width}
          height={width / 4}
          sourceURI={LeaderboardBannerImage}
          resizeMode="contain"
          style={{
            width: "100%",
            height: width / 4,
          }}
        />

        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            marginTop: isMobile ? layout.spacing_x2_5 : 0,
          }}
        >
          <BrandText style={fontSemibold28}>NFT Traders Leaderboard</BrandText>
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{
              height: 32,
              marginTop: isMobile ? layout.spacing_x2_5 : 0,
            }}
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
          <LeaderboardMarketplaceTable />
        </View>
      </View>
    </ScreenContainer>
  );
};
