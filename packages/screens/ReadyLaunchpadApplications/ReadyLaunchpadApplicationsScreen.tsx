import React, { useState } from "react";
import { View } from "react-native";

import { ReadyLaunchApplicationTable } from "./component/ReadyLaunchApplicationTable";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { HighVolSortButton } from "../../components/sorts/HighVolSortButton";
import { Tabs } from "../../components/tabs/Tabs";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export type TabsListType = "readyForListing" | "waitingForApproval";

const dummyData = {
  rank: 1,
  collectionNameData: "The R!ot",
  collectionNetwork: "teritori",
  projectReadinessForMint: "Complete and ready to mint",
  whitelistQuantity: "0",
  premiumMarketingPackage: "No",
  basicMarketingPackage: "Yes",
};

export const ReadyLaunchpadApplicationsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const tabs = {
    readyForListing: {
      name: "Ready for listing",
      badgeCount: 32,
    },
    waitingForApproval: {
      name: "Waiting for approval",
      badgeCount: 42,
    },
  };

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
          <BrandText style={fontSemibold28}>Launchpad Applications</BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            borderTopColor: neutral33,
            borderTopWidth: 1,
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
            paddingVertical: 8,
          }}
        >
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 48, flex: 1 }}
            onSelect={setSelectedTab}
            noUnderline
          />

          {!isMobile && (
            <HighVolSortButton
              style={{ marginLeft: 12 }}
              sortDirection={1}
              onChangeSortDirection={() => {}}
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
          <ReadyLaunchApplicationTable rows={Array(25).fill(dummyData)} />
        </View>
      </View>
    </ScreenContainer>
  );
};
