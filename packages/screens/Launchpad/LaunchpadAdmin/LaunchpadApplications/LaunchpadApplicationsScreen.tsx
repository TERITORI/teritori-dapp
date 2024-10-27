import React, { useState } from "react";
import { View } from "react-native";

import { CompletesTable } from "./../components/CompletesTable";
import { IncompletesTable } from "./../components/IncompletesTable";
import {
  LaunchpadAdminDashboardTabsListType,
  launchpadAdminTabs,
} from "../LaunchpadAdministrationOverview/LaunchpadAdministrationOverviewScreen";
import { ConfirmedsTable } from "../components/ConfirmedsTable";
import { ReviewingsTable } from "../components/ReviewingsTable";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjectsCounts } from "@/hooks/launchpad/useLaunchpadProjectsCounts";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { errorColor, neutral33 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadApplicationsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin } = useIsUserLaunchpadAdmin(userId);
  const { statusCounts } = useLaunchpadProjectsCounts({
    networkId: selectedNetworkId,
  });

  const [selectedTab, setSelectedTab] =
    useState<LaunchpadAdminDashboardTabsListType>("INCOMPLETE");

  if (!isUserLaunchpadAdmin) {
    return (
      <ScreenContainer
        isLarge
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>Unauthorized</BrandText>
        }
        responsive
        onBackPress={() =>
          navigation.navigate("LaunchpadAdministrationOverview")
        }
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <BrandText style={{ color: errorColor, marginTop: layout.spacing_x4 }}>
          Unauthorized
        </BrandText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Administration Dashboard</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("LaunchpadAdministrationOverview")}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
    >
      <View style={{ marginTop: layout.spacing_x4 }}>
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
            alignItems: "center",
            marginTop: 30,
            borderTopColor: neutral33,
            borderTopWidth: 1,
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          }}
        >
          <Tabs
            items={launchpadAdminTabs(statusCounts)}
            selected={selectedTab}
            style={{ height: 58, flex: 1 }}
            onSelect={setSelectedTab}
            noUnderline
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
          {selectedTab === "INCOMPLETE" ? (
            <IncompletesTable limit={100} />
          ) : selectedTab === "COMPLETE" ? (
            <CompletesTable limit={100} />
          ) : selectedTab === "REVIEWING" ? (
            <ReviewingsTable limit={100} />
          ) : selectedTab === "CONFIRMED" ? (
            <ConfirmedsTable limit={100} />
          ) : (
            <></>
          )}
        </View>

        <SpacerColumn size={16} />
      </View>
    </ScreenContainer>
  );
};
