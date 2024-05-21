import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

import { InnerCellText } from "../../../components/applicationTable/InnerCellText";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { mineShaftColor } from "../../../utils/style/colors";
import {
  layout,
  screenContentMaxWidthLarge,
} from "../../../utils/style/layout";

import { LeaderboardEntry } from "@/api/marketplace/v1/marketplace";
import { Pagination } from "@/components/Pagination";
import { UserNameInline } from "@/components/UserNameInline";
import { SpacerColumn } from "@/components/spacer";
import { TableHeader } from "@/components/table/TableHeader";
import { TableColumns } from "@/components/table/utils";
import { getMarketplaceClient } from "@/utils/backend";

const TABLE_COLUMNS: TableColumns = {
  rank: {
    label: "#",
    flex: 1,
  },
  trader: {
    label: "Trader",
    flex: 5,
  },
  totalXp: {
    label: "Total",
    flex: 3,
  },
  bonus: {
    label: "Bonus",
    flex: 2,
  },
  mintXp: {
    label: "Mints",
    flex: 2,
  },
  salesXp: {
    label: "Sales",
    flex: 2,
  },
  buyXp: {
    label: "Buys",
    flex: 2,
  },
};

export const MarketplaceLeaderboardTable: React.FC<{
  networkId: string | undefined;
  timePeriodHours: number;
}> = React.memo(({ networkId, timePeriodHours }) => {
  const isMobile = useIsMobile();
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const { data: leaderboard } = useMarketplaceLeaderboard(
    networkId,
    timePeriodHours,
  );

  // NOTE: we only show the first 100 items, because getting the total count to properly find maxPage will slow the query down
  // see https://stackoverflow.com/questions/28888375/run-a-query-with-a-limit-offset-and-also-get-the-total-number-of-rows

  const numItems = leaderboard?.length || 0;
  const maxPage = Math.max(Math.ceil(numItems / itemsPerPage), 1);

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
        data={leaderboard}
        renderItem={({ item }) => <LeaderboardRowData rowData={item} />}
        keyExtractor={(item) => item.userId}
        style={{
          minHeight: 220,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
        stickyHeaderIndices={[0]}
      />
      <SpacerColumn size={2} />
      <Pagination
        currentPage={pageIndex}
        maxPage={maxPage}
        itemsPerPage={itemsPerPage}
        nbItemsOptions={[100]}
        setItemsPerPage={setItemsPerPage}
        onChangePage={setPageIndex}
      />
      <SpacerColumn size={2} />
    </View>
  );
});

const LeaderboardRowData: React.FC<{ rowData: LeaderboardEntry }> = ({
  rowData,
}) => {
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
      <InnerCellText style={{ flex: TABLE_COLUMNS.rank.flex }}>
        {rowData.rank}
      </InnerCellText>
      <View
        style={{
          flex: TABLE_COLUMNS.trader.flex,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <UserNameInline userId={rowData.userId} />
      </View>
      <InnerCellText
        textStyle={{ paddingLeft: layout.spacing_x1 }}
        style={{ flex: TABLE_COLUMNS.totalXp.flex }}
      >
        {prettyXp(rowData.totalXp)}
      </InnerCellText>
      {!isMobile && (
        <>
          <InnerCellText
            textStyle={{ paddingLeft: layout.spacing_x1 }}
            style={{ flex: TABLE_COLUMNS.bonus.flex }}
          >
            {rowData.boost === 1 ? "-" : `X${rowData.boost}`}
          </InnerCellText>
          <InnerCellText
            textStyle={{ paddingLeft: layout.spacing_x1 }}
            style={{ flex: TABLE_COLUMNS.mintXp.flex }}
          >
            {prettyXp(rowData.mintXp)}
          </InnerCellText>
          <InnerCellText
            textStyle={{ paddingLeft: layout.spacing_x1 }}
            style={{ flex: TABLE_COLUMNS.salesXp.flex }}
          >
            {prettyXp(rowData.sellXp)}
          </InnerCellText>
          <InnerCellText
            textStyle={{ paddingLeft: layout.spacing_x1 }}
            style={{ flex: TABLE_COLUMNS.buyXp.flex }}
          >
            {prettyXp(rowData.buyXp)}
          </InnerCellText>
        </>
      )}
    </View>
  );
};

const prettyXp = (xp: number) => {
  if (xp === 0) {
    return "-";
  }
  if (xp > 0 && xp < 1) {
    return "<1 XP";
  }
  return Math.floor(xp) + " XP";
};

const useMarketplaceLeaderboard = (
  networkId: string | undefined,
  timePeriodHours: number,
) => {
  return useQuery(
    ["marketplace-leaderboard", networkId, timePeriodHours],
    async () => {
      const client = getMarketplaceClient(networkId);
      if (!client) return [];
      const stream = client.Leaderboard({
        networkId,
        periodHours: timePeriodHours,
      });
      const data: LeaderboardEntry[] = [];
      await stream.forEach(({ entry }) => {
        if (!entry) {
          return;
        }
        data.push(entry);
      });
      return data;
    },
  );
};
