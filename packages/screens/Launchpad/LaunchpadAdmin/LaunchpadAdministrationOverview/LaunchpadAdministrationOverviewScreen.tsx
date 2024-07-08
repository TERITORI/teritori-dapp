import React, { useState } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

import { ApplicationStatusCard } from "./component/ApplicationStatusCard";
import { CurrentlyHighlightedProject } from "./component/CurrentlyHighLightedProject";
import { GenesisExplore } from "./component/GenesisExplore";
import { LaunchpadCollectionsTable } from "../LaunchpadApplications/component/LaunchpadCollectionsTable";

import { Sort, SortDirection } from "@/api/launchpad/v1/launchpad";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SecondaryBox } from "@/components/boxes/SecondaryBox";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { zodTryParseJSON } from "@/utils/sanitize";
import { primaryColor } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

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
  const { data: launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    userAddress: selectedWallet?.address || "",
    offset: 0,
    limit: 100,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  });

  const collectionsData: CollectionDataResult[] = [];
  launchpadProjects.forEach((project) => {
    if (!project) {
      return;
    }
    const collectionData: CollectionDataResult | undefined = zodTryParseJSON(
      ZodCollectionDataResult,
      project.collectionData,
    );
    if (!collectionData) return;
    collectionsData.push(collectionData);
  });

  const tabs = {
    pendingApplications: {
      name: "Pending Applications",
      badgeCount: 32,
    },
    pendingConfirmations: {
      name: "Pending Confirmations",
      badgeCount: 42,
    },
  };

  const secTabs = {
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

  const [selectedSecTab, setSelectedSecTab] = useState<SecTabsListType>(
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
            count={32}
            onPress={() => {}} //TODO: don't forget to rewrite onPress function if possible
            isReady={false}
          />
          <ApplicationStatusCard
            label="Pending Confirmations"
            count={156}
            onPress={() => {}} // TODO: don't forget to rewrite onPress function if possible
            style={{
              marginHorizontal:
                width >= MD_BREAKPOINT ? layout.spacing_x1_5 : 0,
              marginVertical: width >= MD_BREAKPOINT ? 0 : layout.spacing_x1_5,
            }}
            isReady={false}
          />
          <ApplicationStatusCard
            label="Ready to Launch"
            count={10123}
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
          <LaunchpadCollectionsTable rows={collectionsData} />
        </View>

        <SpacerColumn size={2} />

        <TouchableOpacity
          onPress={() => navigation.navigate("LaunchpadApplications")}
        >
          <SecondaryBox
            style={{
              alignSelf: "center",
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: primaryColor,
              padding: layout.spacing_x2,
            }}
          >
            <BrandText style={[fontSemibold13, { color: primaryColor }]}>
              Load More
            </BrandText>
          </SecondaryBox>
        </TouchableOpacity>

        <View style={{ marginTop: layout.spacing_x4 }}>
          <Tabs
            items={secTabs}
            selected={selectedSecTab}
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
