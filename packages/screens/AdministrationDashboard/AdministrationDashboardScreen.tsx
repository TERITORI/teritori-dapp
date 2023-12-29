import moment from "moment";
import React, { ReactNode, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

import { CurrentlyHighLightedProject } from "./CurrentlyHighLightedProject";
import guardianPng from "../../../assets/default-images/guardian_1.png";
import etherscanSVG from "../../../assets/icons/etherscan.svg";
import penSVG from "../../../assets/icons/pen.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Box } from "../../components/boxes/Box";
import { GradientText } from "../../components/gradientText";
import { TableRow } from "../../components/table/TableRow";
import { Tabs } from "../../components/tabs/Tabs";
import { ApplicationStatusCard } from "../../components/teritoriNameService/ApplicationStatusCard";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAppNavigation } from "../../utils/navigation";
import {
  gradientColorBlue,
  gradientColorPurple,
  mineShaftColor,
  neutral17,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
  fontSemibold24,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

const MD_BREAKPOINT = 820;
export type TabsListType = "pendingApllications" | "pendingConfirmations";
export type SecTabsListType =
  | "highlightedNewsHero"
  | "upcomingProjectsCarousel"
  | "liveSaleinProgress";

const TABLE_ROWS = {
  rank: {
    label: "#",
    flex: 1,
  },
  collectionNameData: {
    label: "Collection Name",
    flex: 5,
  },
  collectionNetwork: {
    label: "Collection Network",
    flex: 3,
  },
  TwitterURL: {
    label: "Twitter URL",
    flex: 2,
  },
  DiscordURL: {
    label: "Discord URL",
    flex: 2,
  },
  expectedTotalSupply: {
    label: "Expected Total Supply",
    flex: 3,
  },
  expectedPublicMintPrice: {
    label: "Expected Public Mint Price",
    flex: 3,
  },
  expectedMintDate: {
    label: "Expected Mint Date",
    flex: 3,
  },
};

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
            onPress={() => {}}
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

const ApplicationTable: React.FC<{
  rows: any[];
}> = ({ rows }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        justifyContent: "space-between",
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableRow
        headings={
          !isMobile
            ? Object.values(TABLE_ROWS)
            : Object.values(TABLE_ROWS).slice(0, -5)
        }
      />

      <FlatList
        data={rows}
        renderItem={({ item, index }) => <ApplicationRowData rowData={item} />}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 220,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
      />
    </View>
  );
};

const ApplicationRowData: React.FC<{ rowData: any }> = ({ rowData }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingVertical: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x2_5,
      }}
    >
      <InnerCell style={{ flex: TABLE_ROWS.rank.flex }}>
        {rowData.rank}
      </InnerCell>
      <View
        style={{
          flex: TABLE_ROWS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
      >
        <BrandText style={isMobile ? fontSemibold11 : fontSemibold13}>
          {rowData.collectionNameData}
        </BrandText>
      </View>
      <InnerCell style={{ flex: TABLE_ROWS.collectionNetwork.flex }}>
        {rowData["collectionNetwork"]}
      </InnerCell>
      {!isMobile && (
        <>
          <LinkIconAndRedirect style={{ flex: TABLE_ROWS.TwitterURL.flex }}>
            {rowData.TwitterURL}
          </LinkIconAndRedirect>
          <LinkIconAndRedirect style={{ flex: TABLE_ROWS.DiscordURL.flex }}>
            {rowData.DiscordURL}
          </LinkIconAndRedirect>
          <InnerCell
            style={{
              flex: TABLE_ROWS.expectedTotalSupply.flex,
              paddingRight: 0,
            }}
          >
            {rowData.expectedTotalSupply}
          </InnerCell>
          <InnerCell
            style={{
              flex: TABLE_ROWS.expectedPublicMintPrice.flex,
              paddingRight: 0,
            }}
          >
            {rowData.expectedPublicMintPrice}
          </InnerCell>
          <InnerCell
            style={{
              flex: TABLE_ROWS.expectedMintDate.flex,
              paddingRight: 0,
            }}
          >
            {moment(rowData.expectedMintDate).format("MMM D YYYY")}
          </InnerCell>
        </>
      )}
    </View>
  );
};

const LinkIconAndRedirect: React.FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: any;
}> = ({ children, style, textStyle }) => {
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(children);
        }}
      >
        <Box
          style={{
            marginLeft: 6,
            backgroundColor: primaryColor,
            borderRadius: 6,
            width: 25,
            height: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SVG width={20} height={20} source={etherscanSVG} />
        </Box>
      </TouchableOpacity>
    </View>
  );
};

const InnerCell: React.FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}> = ({ children, style, textStyle }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
        },
        style,
      ]}
    >
      <BrandText
        style={[isMobile ? fontSemibold11 : fontSemibold13, textStyle]}
        numberOfLines={1}
      >
        {children}
      </BrandText>
    </View>
  );
};
