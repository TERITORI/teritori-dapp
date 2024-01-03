import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { ApplicationTable } from "./component/ApplicationTable";
import { CurrentlyHighLightedProject } from "./component/CurrentlyHighLightedProject";
import guardianPng from "../../../assets/default-images/guardian_1.png";
import penSVG from "../../../assets/icons/pen.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Box } from "../../components/boxes/Box";
import { GradientText } from "../../components/gradientText";
import { Tabs } from "../../components/tabs/Tabs";
import { ApplicationStatusCard } from "../../components/teritoriNameService/ApplicationStatusCard";
import { useAppNavigation } from "../../utils/navigation";
import {
  gradientColorBlue,
  gradientColorPurple,
  neutral17,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
  fontSemibold24,
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
    collectionNameData: "cachablesadly",
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
            onPress={() => {}}
            isReady={false}
          />
          <ApplicationStatusCard
            label="Pending Confirmations"
            count={156}
            onPress={() => {}}
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
          <Box
            notched
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
          </Box>
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
            <View
              style={{
                marginVertical: 32,
                flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => setIsEditHighlighted(true)}
                  style={{ alignSelf: "flex-start" }}
                >
                  <Box
                    borderGradient={{
                      colors: [gradientColorBlue, gradientColorPurple],
                    }}
                    style={{
                      borderWidth: 1,
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <SVG
                        width={20}
                        height={20}
                        source={penSVG}
                        color="white"
                      />
                      <BrandText style={[fontSemibold13, { marginLeft: 5 }]}>
                        Edit Hero
                      </BrandText>
                    </View>
                  </Box>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 5,
                  flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <BrandText style={fontSemibold24}>
                    Genesis Guardians
                  </BrandText>
                  <GradientText
                    gradientType="blueExtended"
                    style={[
                      fontSemibold14,
                      {
                        marginTop: 10,
                      },
                    ]}
                  >
                    EXCLUSIVE GENESIS TERITORI COLLECTION
                  </GradientText>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AllProjectAdministrationDash")
                    }
                  >
                    <Box
                      notched
                      style={{
                        alignSelf: "flex-start",
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                        backgroundColor: primaryColor,
                        marginTop: 24,
                      }}
                    >
                      <BrandText style={[fontSemibold13, { color: neutral17 }]}>
                        Explore collection
                      </BrandText>
                    </Box>
                  </TouchableOpacity>
                </View>
                <View style={{ marginRight: layout.spacing_x4, flex: 2 }}>
                  <Image
                    style={{
                      width: 524,
                      height: 524,
                      borderRadius: 12,
                    }}
                    source={guardianPng}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
