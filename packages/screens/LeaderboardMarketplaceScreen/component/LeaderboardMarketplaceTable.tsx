import React from "react";
import { FlatList, Image, View } from "react-native";

import DefaultEnemyPNG from "../../../../assets/game/default-enemy.png";
import { InnerCellText } from "../../../components/applicationTable/InnerCellText";
import { TableRow } from "../../../components/table/TableRow";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { mineShaftColor } from "../../../utils/style/colors";
import {
  layout,
  screenContentMaxWidthLarge,
} from "../../../utils/style/layout";

import { Pagination } from "@/components/Pagination";
import { SpacerColumn } from "@/components/spacer";

const TABLE_ROWS = {
  rank: {
    label: "#",
    flex: 1,
  },
  trader: {
    label: "Trader",
    flex: 5,
  },
  totalXp: {
    label: "Total XP",
    flex: 3,
  },
  bonus: {
    label: "Bonus",
    flex: 2,
  },
  listingXp: {
    label: "Listing XP",
    flex: 2,
  },
  salesXp: {
    label: "Sales XP",
    flex: 3,
  },
  buyXp: {
    label: "Buy XP",
    flex: 3,
  },
};

export const LeaderboardMarketplaceTable: React.FC<{
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
            : Object.values(TABLE_ROWS).slice(0, -4)
        }
      />

      <FlatList
        data={rows}
        renderItem={({ item, index }) => <LeaderboardRowData rowData={item} />}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 220,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
        stickyHeaderIndices={[0]}
      />
      <SpacerColumn size={2} />
      <Pagination
        currentPage={1}
        maxPage={120}
        itemsPerPage={50}
        dropdownOptions={[50, 100, 200]}
        setItemsPerPage={() => {}}
        onChangePage={() => {}}
      />
      <SpacerColumn size={2} />
    </View>
  );
};

const LeaderboardRowData: React.FC<{ rowData: any }> = ({ rowData }) => {
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
      <InnerCellText style={{ flex: TABLE_ROWS.rank.flex }}>
        {rowData.rank}
      </InnerCellText>
      <View
        style={{
          flex: TABLE_ROWS.trader.flex,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image source={DefaultEnemyPNG} style={{ height: 32, width: 32 }} />
        <InnerCellText style={{ marginLeft: layout.spacing_x1 }}>
          {rowData.trader}
        </InnerCellText>
      </View>
      <InnerCellText style={{ flex: TABLE_ROWS.totalXp.flex }}>
        {rowData.totalXp}
      </InnerCellText>
      {!isMobile && (
        <>
          <InnerCellText style={{ flex: TABLE_ROWS.bonus.flex }}>
            {rowData.bonus}
          </InnerCellText>
          <InnerCellText style={{ flex: TABLE_ROWS.listingXp.flex }}>
            {rowData.listingXp}
          </InnerCellText>
          <InnerCellText style={{ flex: TABLE_ROWS.salesXp.flex }}>
            {rowData.salesXp}
          </InnerCellText>
          <InnerCellText style={{ flex: TABLE_ROWS.buyXp.flex }}>
            {rowData.buyXp}
          </InnerCellText>
        </>
      )}
    </View>
  );
};
