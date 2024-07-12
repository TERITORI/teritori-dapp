import React, { FC, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { ApplicationStatusCard } from "./component/ApplicationStatusCard";
import { CurrentlyHighlightedProject } from "./component/CurrentlyHighLightedProject";
import { GenesisExplore } from "./component/GenesisExplore";
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
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { collectionsData } from "@/utils/launchpad";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 820;
type TabsListType = "pendingApplications" | "pendingConfirmations";
type SecTabsListType =
  | "highlightedNewsHero"
  | "upcomingProjectsCarousel"
  | "liveSaleinProgress";

export const LaunchpadAdministrationOverviewScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { width } = useWindowDimensions();
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

  const herosTabs = {
    highlightedNewsHero: {
      name: "Highlighted News Hero",
      badgeCount: 3,
    },
    upcomingProjectsCarousel: {
      name: "Upcoming Projects Carousel",
      badgeCount: 12,
    },
    liveSaleinProgress: {
      name: "Live Sale in Progress",
      badgeCount: 52,
    },
  };

  const [selectedTab, setSelectedTab] = useState<TabsListType>(
    "pendingApplications",
  );

  const [selectedHerosTab, setSelectedSecTab] = useState<SecTabsListType>(
    "highlightedNewsHero",
  );

  const [isEditHighlighted, setIsEditHighlighted] = useState<boolean>(false);

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
          {/*// TODO: Is it status COMPLETE ? */}
          <ApplicationStatusCard
            label="Ready to Launch"
            count={counts?.countComplete || 0}
            onPress={() => navigation.navigate("LaunchpadReadyApplications")}
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

        <View style={{ marginTop: layout.spacing_x4 }}>
          <Tabs
            items={herosTabs}
            selected={selectedHerosTab}
            style={{ height: 48 }}
            onSelect={setSelectedSecTab}
          />

          {isEditHighlighted ? (
            <CurrentlyHighlightedProject
              setIsEditHighlighted={setIsEditHighlighted}
            />
          ) : (
            <GenesisExplore setIsEditHighlighted={setIsEditHighlighted} />
          )}
        </View>
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
    limit: 10,
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
    limit: 10,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_COMPLETE,
  });
  return (
    <LaunchpadCollectionsTable rows={collectionsData(launchpadProjects)} />
  );
};
