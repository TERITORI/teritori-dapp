import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { ConfirmedsTable } from "./../components/ConfirmedsTable";
import { ReviewingsTable } from "./../components/ReviewingsTable";
import { ApplicationStatusCard } from "./components/ApplicationStatusCard";
import { CompletesTable } from "../components/CompletesTable";
import { IncompletesTable } from "../components/IncompletesTable";

import { StatusCount } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useIsUserLaunchpadAdmin } from "@/hooks/launchpad/useIsUserLaunchpadAdmin";
import { useLaunchpadProjectsCounts } from "@/hooks/launchpad/useLaunchpadProjectsCounts";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { statusToCount } from "@/utils/launchpad";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 820;
export type LaunchpadAdminDashboardTabsListType =
  | "INCOMPLETE"
  | "COMPLETE"
  | "REVIEWING"
  | "CONFIRMED";

export const launchpadAdminTabs = (statusCounts?: StatusCount[]) => {
  return {
    INCOMPLETE: {
      name: "INCOMPLETE",
      badgeCount: statusToCount("INCOMPLETE", statusCounts),
    },
    COMPLETE: {
      name: "COMPLETE",
      badgeCount: statusToCount("COMPLETE", statusCounts),
    },
    REVIEWING: {
      name: "REVIEWING",
      badgeCount: statusToCount("REVIEWING", statusCounts),
    },
    CONFIRMED: {
      name: "CONFIRMED",
      badgeCount: statusToCount("CONFIRMED", statusCounts),
    },
  };
};

export const LaunchpadAdministrationOverviewScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = useSelectedWallet()?.userId;
  const { isUserLaunchpadAdmin, isLoading: isUserAdminLoading } =
    useIsUserLaunchpadAdmin(userId);

  const { width } = useWindowDimensions();
  const { statusCounts } = useLaunchpadProjectsCounts({
    networkId: selectedNetworkId,
  });

  const [selectedTab, setSelectedTab] =
    useState<LaunchpadAdminDashboardTabsListType>("INCOMPLETE");

  if (!isUserLaunchpadAdmin)
    return (
      <ScreenContainer
        isLarge
        footerChildren={<></>}
        headerChildren={
          <BrandText style={fontSemibold20}>
            {isUserAdminLoading ? "Loading..." : "Unauthorized"}
          </BrandText>
        }
        responsive
        forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      >
        <BrandText
          style={[
            { marginTop: layout.spacing_x4 },
            !isUserAdminLoading && { color: errorColor },
          ]}
        >
          {isUserAdminLoading ? "Loading..." : "Unauthorized"}
        </BrandText>
      </ScreenContainer>
    );

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Administration Dashboard</BrandText>
      }
      responsive
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
          <BrandText style={fontSemibold28}>
            Launchpad Administration Overview
          </BrandText>
        </View>

        <View
          style={{
            marginVertical: layout.spacing_x3,
            flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
            justifyContent: "center",
          }}
        >
          <ApplicationStatusCard
            label="INCOMPLETE"
            count={statusToCount("INCOMPLETE", statusCounts)}
          />
          <ApplicationStatusCard
            label="COMPLETE"
            count={statusToCount("COMPLETE", statusCounts)}
            style={{
              marginHorizontal:
                width >= MD_BREAKPOINT ? layout.spacing_x1_5 : 0,
              marginVertical: width >= MD_BREAKPOINT ? 0 : layout.spacing_x1_5,
            }}
          />
          <ApplicationStatusCard
            label="REVIEWING"
            count={statusToCount("REVIEWING", statusCounts)}
            // onPress={
            //   // counts?.countConfirmed
            //   counts?.countConfirmed
            //     ? () => navigation.navigate("LaunchpadReadyApplications")
            //     : undefined
            // }
            isReady
          />
        </View>

        <Tabs
          items={launchpadAdminTabs(statusCounts)}
          selected={selectedTab}
          style={{ height: 48 }}
          onSelect={setSelectedTab}
          noUnderline
        />

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
            <IncompletesTable limit={10} />
          ) : selectedTab === "COMPLETE" ? (
            <CompletesTable limit={10} />
          ) : selectedTab === "REVIEWING" ? (
            <ReviewingsTable limit={10} />
          ) : selectedTab === "CONFIRMED" ? (
            <ConfirmedsTable limit={10} />
          ) : (
            <></>
          )}
        </View>

        <SpacerColumn size={2} />

        <PrimaryButtonOutline
          size="M"
          text="Load More"
          onPress={() => navigation.navigate("LaunchpadApplications")}
          style={{ alignSelf: "center" }}
        />
      </View>
    </ScreenContainer>
  );
};
