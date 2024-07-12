import React, { FC, useMemo, useState } from "react";
import { View } from "react-native";

import { Sort, SortDirection, Status } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { HighVolSortButton } from "@/components/sorts/HighVolSortButton";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";
import { useLaunchpadProjectsCounts } from "@/hooks/launchpad/useLaunchpadProjectsCounts";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { LaunchpadCollectionsTable } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplications/component/LaunchpadCollectionsTable";
import { collectionsData } from "@/utils/launchpad";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type TabsListType = "pendingApplications" | "pendingConfirmations";

export const LaunchpadApplicationsScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { counts } = useLaunchpadProjectsCounts(
    {
      networkId: selectedNetworkId,
      userAddress: selectedWallet?.address || "",
    },
    [Status.STATUS_COMPLETE, Status.STATUS_INCOMPLETE],
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
          {selectedTab === "pendingApplications" ? (
            <PendingApplicationsTable />
          ) : selectedTab === "pendingConfirmations" ? (
            <PendingConfirmationsTable />
          ) : (
            <></>
          )}{" "}
        </View>

        <SpacerColumn size={16} />
      </View>
    </ScreenContainer>
  );
};

const PendingApplicationsTable: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 100, // TODO: Pagination
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_INCOMPLETE,
  });
  return (
    <LaunchpadCollectionsTable rows={collectionsData(launchpadProjects)} />
  );
};

const PendingConfirmationsTable: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 100, // TODO: Pagination
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_COMPLETE,
  });
  return (
    <LaunchpadCollectionsTable rows={collectionsData(launchpadProjects)} />
  );
};
