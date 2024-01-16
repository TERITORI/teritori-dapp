import React, { useState } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

import { ApplicationTable } from "./component/ApplicationTable";
import { CurrentlyHighLightedProject } from "./component/CurrentlyHighLightedProject";
import { GenesisExplore } from "./component/GenesisExplore";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryBox } from "../../components/boxes/SecondaryBox";
import { Tabs } from "../../components/tabs/Tabs";
import { ApplicationStatusCard } from "../../components/teritoriNameService/ApplicationStatusCard";
import { useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const MD_BREAKPOINT = 820;
export type TabsListType = "pendingApllications" | "pendingConfirmations";
export type SecTabsListType =
  | "highlightedNewsHero"
  | "upcomingProjectsCarousel"
  | "liveSaleinProgress";

const dummyData = [
  {
    rank: 1,
    collectionNameData: "The R!ot",
    collectionNetwork: "teritori",
    TwitterURL: "https://www.lipsum.com/",
    DiscordURL: "https://www.lipsum.com/",
    expectedTotalSupply: 3000,
    expectedPublicMintPrice: "550 L",
    expectedMintDate: new Date(),
  },
  {
    rank: 2,
    collectionNameData: "throw back push chair",
    collectionNetwork: "solanaL",
    TwitterURL: "https://www.lipsum.com/",
    DiscordURL: "https://www.lipsum.com/",
    expectedTotalSupply: 3000,
    expectedPublicMintPrice: "550 L",
    expectedMintDate: new Date(),
  },
  {
    rank: 3,
    collectionNameData: "cachablesadly back push chair",
    collectionNetwork: "solanaL",
    TwitterURL: "https://www.lipsum.com/",
    DiscordURL: "https://www.lipsum.com/",
    expectedTotalSupply: 3000,
    expectedPublicMintPrice: "550 L",
    expectedMintDate: new Date(),
  },
];

export const AdministrationDashboardScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();

  const tabs = {
    pendingApllications: {
      name: "Pending Apllications",
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
    "pendingApllications",
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
          <BrandText style={fontSemibold28}>
            Launchpad Administration Overview
          </BrandText>
        </View>

        <View
          style={{
            marginVertical: 24,
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
              marginHorizontal: width >= MD_BREAKPOINT ? 12 : 0,
              marginVertical: width >= MD_BREAKPOINT ? 0 : 12,
            }}
            isReady={false}
          />
          <ApplicationStatusCard
            label="Ready to Launch"
            count={10123}
            onPress={() => navigation.navigate("ReadyLaunchpadApplications")}
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
          <ApplicationTable rows={dummyData} />
        </View>

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
              padding: 16,
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
            <CurrentlyHighLightedProject
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
