import moment from "moment";
import React, { ReactNode } from "react";
import {
  FlatList,
  Linking,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import avaPNG from "../../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../../assets/icons/check-badge.svg";
import externalLinkSVG from "../../../../assets/icons/external-link.svg";
import SolanaCircleSVG from "../../../../assets/icons/networks/solana-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { LinkView } from "../../../components/linkView/LinkView";
import { TableRow } from "../../../components/table/TableRow";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { mineShaftColor } from "../../../utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "../../../utils/style/fonts";
import {
  layout,
  screenContentMaxWidthLarge,
} from "../../../utils/style/layout";

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

export const ApplicationTable: React.FC<{
  rows: any[]; // currently i don't know the data types will change it once i will work on functionality
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
      <LinkView
        style={{
          flex: TABLE_ROWS.collectionNameData.flex,
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          marginRight: layout.spacing_x3,
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
        <InnerCell
          style={{
            marginLeft: 8,
          }}
        >
          {rowData["collectionNetwork"]}
        </InnerCell>
      </View>
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
        <SVG source={externalLinkSVG} color="white" />
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
