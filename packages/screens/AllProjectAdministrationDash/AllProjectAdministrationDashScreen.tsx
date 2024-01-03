import React, { ReactNode, useState } from "react";
import { FlatList, StyleProp, TextStyle, View, ViewStyle } from "react-native";

import avaPNG from "../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../assets/icons/check-badge.svg";
import cryptoLogoSVG from "../../../assets/icons/crypto-logo.svg";
import downArrowSVG from "../../../assets/icons/downArrow.svg";
import upArrowSVG from "../../../assets/icons/upArrow.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { RoundedGradientImage } from "../../components/images/RoundedGradientImage";
import { LinkView } from "../../components/linkView/LinkView";
import { HighVolSortButton } from "../../components/sorts/HighVolSortButton";
import { TableRow } from "../../components/table/TableRow";
import { Tabs } from "../../components/tabs/Tabs";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAppNavigation } from "../../utils/navigation";
import {
  errorColor,
  mineShaftColor,
  neutral33,
  successColor,
} from "../../utils/style/colors";
import {
  fontSemibold11,
  fontSemibold13,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";

export type TabsListType =
  | "all"
  | "verified"
  | "ethereum"
  | "solana"
  | "cosmos";

const TABLE_ROWS = {
  rank: {
    label: "#",
    flex: 1,
  },
  collectionNameData: {
    label: "Collection Name",
    flex: 5,
  },
  floor: {
    label: "Floor",
    flex: 3,
  },
  totalVol: {
    label: "Total Vol",
    flex: 3,
  },
  vol: {
    label: "24h Vol",
    flex: 3,
  },
  volPerctage: {
    label: "24h Vol %",
    flex: 3,
  },
};

const dummyData = [
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "+24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "-24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "+24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "-24.26%",
  },
];

export const AllProjectAdministrationDashScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const tabs = {
    all: {
      name: "All",
    },
    verified: {
      name: "Verified",
    },
    ethereum: {
      name: "Ethereum",
    },
    solana: {
      name: "Solana",
    },
    cosmos: {
      name: "Cosmos",
    },
  };

  const [selectedTab, setSelectedTab] = useState<TabsListType>("all");

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
          <BrandText style={fontSemibold28}>All Projects</BrandText>
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
          <ApplicationTable rows={dummyData} />
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
      <LinkView
        style={{
          flex: TABLE_ROWS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          paddingRight: layout.spacing_x1,
        }}
        to={{
          screen: "ApplicationReview",
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
        <SVG source={checkBadgeSVG} />
      </LinkView>
      <InnerCell style={{ flex: TABLE_ROWS.floor.flex }}>
        {rowData.floor}
      </InnerCell>
      {!isMobile && (
        <>
          <InnerCell style={{ flex: TABLE_ROWS.totalVol.flex }}>
            {rowData.totalVol}
          </InnerCell>
          <InnerCell style={{ flex: TABLE_ROWS.vol.flex }}>
            {rowData.vol}
          </InnerCell>
          <PercentageVolume
            data={rowData.volPerctage}
            style={{ flex: TABLE_ROWS.volPerctage.flex }}
          />
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
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
        },
        style,
      ]}
    >
      <SVG source={cryptoLogoSVG} />
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          { marginLeft: 8 },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </BrandText>
    </View>
  );
};

const PercentageVolume: React.FC<{
  data: any;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
        },
        style,
      ]}
    >
      {data.includes("+") ? (
        <SVG source={upArrowSVG} />
      ) : (
        <SVG source={downArrowSVG} />
      )}
      <BrandText
        style={[
          isMobile ? fontSemibold11 : fontSemibold13,
          {
            marginLeft: 8,
            color: data.includes("+") ? successColor : errorColor,
          },
        ]}
        numberOfLines={1}
      >
        {data}
      </BrandText>
    </View>
  );
};
