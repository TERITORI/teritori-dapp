import React from "react";
import { FlatList, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { CollectionNameCell } from "../../../components/applicationTable/CollectionNameCell";
import { InnerCellText } from "../../../components/applicationTable/InnerCellText";
import { PercentageVolumeCell } from "../../../components/applicationTable/PercentageVolumeCell";
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
      <InnerCellText isCryptoLogo style={{ flex: TABLE_ROWS.floor.flex }}>
        {rowData.floor}
      </InnerCellText>
      {!isMobile && (
        <>
          <InnerCellText
            isCryptoLogo
            style={{ flex: TABLE_ROWS.totalVol.flex }}
          >
            {rowData.totalVol}
          </InnerCellText>
          <InnerCellText isCryptoLogo style={{ flex: TABLE_ROWS.vol.flex }}>
            {rowData.vol}
          </InnerCellText>
          <PercentageVolumeCell
            value={rowData.volPerctage}
            style={{ flex: TABLE_ROWS.volPerctage.flex }}
          />
        </>
      )}
    </View>
  );
};
