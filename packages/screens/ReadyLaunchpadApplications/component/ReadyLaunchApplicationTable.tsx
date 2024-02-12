import React from "react";
import { FlatList, View } from "react-native";

import { CellBadgeRow } from "./CellBadgeRow";
import dotsSVG from "../../../../assets/icons/dots.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CollectionNameCell } from "@/components/applicationTable/CollectionNameCell";
import { InnerCellText } from "@/components/applicationTable/InnerCellText";
import { TableRow } from "@/components/table/TableRow";
import { useIsMobile } from "@/hooks/useIsMobile";
import { lightblue, mineShaftColor, neutral00 } from "@/utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "@/utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";

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

export const ReadyLaunchApplicationTable: React.FC<{
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
      <CollectionNameCell
        rowData={rowData}
        style={{ flex: TABLE_ROWS.collectionNameData.flex }}
      />
      <InnerCellText
        isSolanaIcon
        style={{
          flex: TABLE_ROWS.collectionNetwork.flex,
        }}
      >
        {rowData["collectionNetwork"]}
      </InnerCellText>
      {!isMobile && (
        <>
          <CellBadgeRow
            style={{ flex: TABLE_ROWS.projectReadinessForMint.flex }}
            text={rowData.projectReadinessForMint}
          />
          <CellBadgeRow
            style={{ flex: TABLE_ROWS.whitelistQuantity.flex }}
            text={rowData.whitelistQuantity}
          />
          <CellBadgeRow
            style={{ flex: TABLE_ROWS.premiumMarketingPackage.flex }}
            text={rowData.premiumMarketingPackage}
          />
          <View
            style={{
              flex: TABLE_ROWS.basicMarketingPackage.flex,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <InnerCellText
                style={{
                  backgroundColor: lightblue,
                  borderRadius: 100,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  alignSelf: "flex-start",
                }}
                textStyle={{ color: neutral00 }}
              >
                {rowData.basicMarketingPackage}
              </InnerCellText>
            </View>
            <SVG
              source={dotsSVG}
              height={16}
              width={16}
              style={{ marginLeft: layout.spacing_x0_5 }}
            />
          </View>
        </>
      )}
    </View>
  );
};
