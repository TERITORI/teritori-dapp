import React, { FC, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { ApplicationStatusCard } from "./component/ApplicationStatusCard";
import { LaunchpadCollectionsTable } from "../LaunchpadApplications/component/LaunchpadCollectionsTable";

import { Sort, SortDirection, Status } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";
import { useLaunchpadProjectsCounts } from "@/hooks/launchpad/useLaunchpadProjectsCounts";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { MarketingEdition } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/MarketingEdition";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 820;
type TabsListType = "pendingApplications" | "pendingConfirmations";

export const LaunchpadAdministrationOverviewScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const { width } = useWindowDimensions();
  const { counts } = useLaunchpadProjectsCounts(
    {
      networkId: selectedNetworkId,
      // userAddress: selectedWallet?.address || "",
    },
    [Status.STATUS_COMPLETE, Status.STATUS_INCOMPLETE, Status.STATUS_CONFIRMED],
  );

  const tabs = useMemo(() => {
    return {
      pendingApplications: {
        name: "Pending Applications",
        badgeCount: counts?.countIncomplete || 0,
      },
      pendingConfirmations: {
        name: "Pending Confirmations",
        badgeCount: counts?.countComplete || 0,
      },
    };
  }, [counts]);

  const [selectedTab, setSelectedTab] = useState<TabsListType>(
    "pendingApplications",
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
            label="Pending Applications"
            count={counts?.countIncomplete || 0}
            isReady={false}
          />
          <ApplicationStatusCard
            label="Pending Confirmations"
            count={counts?.countComplete || 0}
            style={{
              marginHorizontal:
                width >= MD_BREAKPOINT ? layout.spacing_x1_5 : 0,
              marginVertical: width >= MD_BREAKPOINT ? 0 : layout.spacing_x1_5,
            }}
            isReady={false}
          />
          <ApplicationStatusCard
            label="Ready to Launch"
            count={counts?.countConfirmed || 0}
            onPress={
              counts?.countConfirmed
                ? () => navigation.navigate("LaunchpadReadyApplications")
                : undefined
            }
            isReady
          />
        </View>

        <Tabs
          items={tabs}
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
          {selectedTab === "pendingApplications" ? (
            <PendingApplicationsTable />
          ) : selectedTab === "pendingConfirmations" ? (
            <PendingConfirmationsTable />
          ) : (
            <></>
          )}
        </View>

        <SpacerColumn size={2} />

        <PrimaryButtonOutline
          size="M"
          text=" Load More"
          onPress={() => navigation.navigate("LaunchpadApplications")}
          style={{ alignSelf: "center" }}
        />

        <MarketingEdition />
      </View>
    </ScreenContainer>
  );
};

const PendingApplicationsTable: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    // userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 10,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_INCOMPLETE,
  });
  return <LaunchpadCollectionsTable rows={launchpadProjects} />;
};

const PendingConfirmationsTable: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    // userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 10,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_COMPLETE,
  });
  return <LaunchpadCollectionsTable rows={launchpadProjects} />;
};
