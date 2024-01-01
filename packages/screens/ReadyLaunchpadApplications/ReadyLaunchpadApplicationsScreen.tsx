import React, { ReactNode, useState } from "react";
import { FlatList, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { ShieldCheckIcon } from "react-native-heroicons/outline";

import avaPNG from "../../../assets/default-images/ava.png";
import SolanaCircleSVG from "../../../assets/icons/networks/solana-circle.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { HighVolSortButton } from "../../components/sorts/HighVolSortButton";
import { TableRow } from "../../components/table/TableRow";
import { Tabs } from "../../components/tabs/Tabs";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAppNavigation } from "../../utils/navigation";
import {
  lightblue,
  mineShaftColor,
  neutral00,
  neutral33,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

export type TabsListType = "readyForListing" | "waitingForApproval";

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
  projectReadinessForMint: {
    label: "Project Readiness for Mint",
    flex: 3,
  },
  whitelistQuantity: {
    label: "Whitelist quantity",
    flex: 2,
  },
  premiumMarketingPackage: {
    label: "Premium marketing package",
    flex: 2,
  },
  basicMarketingPackage: {
    label: "Basic marketing package",
    flex: 2,
  },
};

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
          <ApplicationTable rows={Array(25).fill(dummyData)} />
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
      <BrandText
        style={[
          { flex: TABLE_ROWS.rank.flex },
          isMobile ? fontSemibold11 : fontSemibold13,
        ]}
      >
        {rowData.rank}
      </BrandText>
      <View
        style={{
          flex: TABLE_ROWS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
      >
        <RoundedGradientImage
          size="XS"
          sourceURI={avaPNG}
          style={{ marginRight: isMobile ? 8 : 16 }}
        />
        <BrandText
          style={[
            isMobile ? fontSemibold11 : fontSemibold13,
            { marginRight: 8 },
          ]}
        >
          {rowData.collectionNameData}
        </BrandText>
        <ShieldCheckIcon color={primaryColor} width={20} height={20} />
      </View>
      <View
        style={{
          flex: TABLE_ROWS.collectionNetwork.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
      >
        <SVG width={20} height={20} source={SolanaCircleSVG} color="white" />
        <BrandText
          style={[
            isMobile ? fontSemibold11 : fontSemibold13,
            { marginLeft: 8 },
          ]}
        >
          {rowData["collectionNetwork"]}
        </BrandText>
      </View>
      {!isMobile && (
        <>
          <InnerCell style={{ flex: TABLE_ROWS.projectReadinessForMint.flex }}>
            {rowData.projectReadinessForMint}
          </InnerCell>
          <InnerCell style={{ flex: TABLE_ROWS.whitelistQuantity.flex }}>
            {rowData.whitelistQuantity}
          </InnerCell>
          <InnerCell
            style={{
              flex: TABLE_ROWS.premiumMarketingPackage.flex,
              paddingRight: 0,
            }}
          >
            {rowData.premiumMarketingPackage}
          </InnerCell>
          <InnerCell
            style={{
              flex: TABLE_ROWS.basicMarketingPackage.flex,
              paddingRight: 0,
            }}
          >
            {rowData.basicMarketingPackage}
          </InnerCell>
        </>
      )}
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
      <View
        style={{
          backgroundColor: lightblue,
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 100,
        }}
      >
        <BrandText
          style={[
            isMobile ? fontSemibold11 : fontSemibold13,
            { color: neutral00 },
            textStyle,
          ]}
          numberOfLines={1}
        >
          {children}
        </BrandText>
      </View>
    </View>
  );
};
