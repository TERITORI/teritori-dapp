import React from "react";
import { FlatList, View } from "react-native";

import dotsSVG from "../../../../assets/icons/dots.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CollectionNameCell } from "@/components/applicationTable/CollectionNameCell";
import { InnerCellText } from "@/components/applicationTable/InnerCellText";
import { PercentageVolumeCell } from "@/components/applicationTable/PercentageVolumeCell";
import { TableColumns, TableHeader } from "@/components/table/TableHeader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { mineShaftColor } from "@/utils/style/colors";
import { fontSemibold11, fontSemibold13 } from "@/utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";

const TABLE_COLUMNS: TableColumns = {
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

export const AllApplicationTable: React.FC<{
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
      <TableHeader
        style={{
          paddingHorizontal: layout.spacing_x2_5,
        }}
        columns={
          !isMobile
            ? TABLE_COLUMNS
            : Object.fromEntries(Object.entries(TABLE_COLUMNS).slice(0, -5))
        }
      />
      <FlatList
        data={rows}
        renderItem={({ item }) => <ApplicationRowData rowData={item} />}
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
          { flex: TABLE_COLUMNS.rank.flex },
          isMobile ? fontSemibold11 : fontSemibold13,
        ]}
      >
        {rowData.rank}
      </BrandText>
      <CollectionNameCell
        rowData={rowData}
        style={{ flex: TABLE_COLUMNS.collectionNameData.flex }}
      />
      <InnerCellText isCryptoLogo style={{ flex: TABLE_COLUMNS.floor.flex }}>
        {rowData.floor}
      </InnerCellText>
      {!isMobile && (
        <>
          <InnerCellText
            isCryptoLogo
            style={{ flex: TABLE_COLUMNS.totalVol.flex }}
          >
            {rowData.totalVol}
          </InnerCellText>
          <InnerCellText isCryptoLogo style={{ flex: TABLE_COLUMNS.vol.flex }}>
            {rowData.vol}
          </InnerCellText>
          <View
            style={{
              flex: TABLE_COLUMNS.volPerctage.flex,
              flexDirection: "row",
            }}
          >
            <PercentageVolumeCell
              value={rowData.volPerctage}
              style={{ flex: 1 }}
            />
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
