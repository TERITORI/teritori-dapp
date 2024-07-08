import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { HighVolSortButton } from "@/components/sorts/HighVolSortButton";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NetworkFeature } from "@/networks";
import { LaunchpadReadyApplicationsTable } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadReadyApplications/component/LaunchpadReadyApplicationsTable";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type TabsListType = "readyForListing" | "waitingForApproval";

export interface DummyLaunchpadReadyCollection {
  id: number;
  rank: number;
  collectionName: string;
  collectionNetwork: string;
  projectReadinessForMint: string;
  whitelistQuantity: string;
  premiumMarketingPackage: string;
  basicMarketingPackage: string;
}

export const LaunchpadReadyApplicationsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const tabs = {
    readyForListing: {
      name: "Ready for Listing",
      badgeCount: 32,
    },
    waitingForApproval: {
      name: "Waiting for Approval",
      badgeCount: 42,
    },
  };

  const dummyData: DummyLaunchpadReadyCollection[] = Array(25)
    .fill({
      id: 0,
      rank: 0,
      collectionName: "The R!ot",
      collectionNetwork: "teritori",
      projectReadinessForMint: "Complete and ready to mint",
      whitelistQuantity: "0",
      premiumMarketingPackage: "No",
      basicMarketingPackage: "Yes",
    })
    .map((item, index) => ({ ...item, id: index + 1, rank: index + 1 }));

  const [selectedTab, setSelectedTab] =
    useState<TabsListType>("readyForListing");

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Administration Dashboard</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold28}>Ready to Launch</BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            borderTopColor: neutral33,
            borderTopWidth: 1,
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          }}
        >
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 58, flex: 1 }}
            onSelect={setSelectedTab}
            noUnderline
          />

          {!isMobile && (
            <HighVolSortButton
              style={{ marginLeft: 12 }}
              sortDirection={1}
              onChangeSortDirection={() => {}} // TODO: don't forget to rewrite onPress function if possible
              height={42}
            />
          )}
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
          <LaunchpadReadyApplicationsTable rows={dummyData} />
        </View>

        <SpacerColumn size={16} />
      </View>
    </ScreenContainer>
  );
};
