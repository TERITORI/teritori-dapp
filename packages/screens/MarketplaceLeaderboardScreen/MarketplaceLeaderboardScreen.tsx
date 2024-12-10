import React, { useState } from "react";
import { ObjectKeys } from "react-hook-form/dist/types/path/common";
import { View, useWindowDimensions } from "react-native";

import { MarketplaceLeaderboardTable } from "./component/MarketplaceLeaderboardTable";
import LeaderboardBannerImage from "../../../assets/banners/LeaderboardBanner.png";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

import { OptimizedImage } from "@/components/OptimizedImage";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { Tabs } from "@/components/tabs/Tabs";
import { useEnabledNetworks } from "@/hooks/useEnabledNetworks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NetworkFeature } from "@/networks";

export const MarketplaceLeaderboardScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  const isMobile = useIsMobile();

  const networks = useEnabledNetworks();
  const tabs = networks.reduce(
    (r, n) => {
      if (!n.features.includes(NetworkFeature.NFTMarketplaceLeaderboard)) {
        return r;
      }
      r[n.id] = { name: n.displayName };
      return r;
    },
    {} as Record<string, { name: string }>,
  );
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0]);
  const networkId = selectedTab;

  const timeTabs = {
    "7d": {
      name: "7 days",
      hours: 24 * 7,
    },
    "30d": {
      name: "30 days",
      hours: 24 * 30,
    },
  };
  const [selectedPeriod, setSelectedPeriod] =
    useState<ObjectKeys<typeof timeTabs>>("30d");

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={<ScreenTitle>NFT Traders Leaderboard</ScreenTitle>}
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
          <View
            style={{
              flexDirection: isMobile ? "column-reverse" : "row",
              gap: layout.spacing_x4,
              marginTop: isMobile ? layout.spacing_x2_5 : 0,
            }}
          >
            <Tabs
              items={timeTabs}
              selected={selectedPeriod}
              style={{ height: 32 }}
              onSelect={setSelectedPeriod}
            />
            <Tabs
              items={tabs}
              selected={selectedTab}
              style={{ height: 32 }}
              onSelect={setSelectedTab}
            />
          </View>
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
          <MarketplaceLeaderboardTable
            networkId={networkId}
            timePeriodHours={timeTabs[selectedPeriod].hours}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
