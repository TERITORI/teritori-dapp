import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

import { screenContentMaxWidthLarge } from "../../../utils/style/layout";

import { LeaderboardEntry } from "@/api/marketplace/v1/marketplace";
import { UserNameInline } from "@/components/UserNameInline";
import { SpacerColumn } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { getMarketplaceClient } from "@/utils/backend";

const columns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  userId: {
    label: "Trader",
    minWidth: 200,
    flex: 2.5,
  },
  totalXp: {
    label: "Total",
    flex: 1.5,
    minWidth: 120,
  },
  boost: {
    label: "Bonus",
    flex: 1,
    minWidth: 100,
  },
  mintXp: {
    label: "Mints",
    flex: 1,
    minWidth: 100,
  },
  sellXp: {
    label: "Sales",
    flex: 1,
    minWidth: 100,
  },
  buyXp: {
    label: "Buys",
    flex: 1,
    minWidth: 100,
  },
};

const breakpointM = 890;

export const MarketplaceLeaderboardTable: React.FC<{
  networkId: string | undefined;
  timePeriodHours: number;
}> = React.memo(({ networkId, timePeriodHours }) => {
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
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableWrapper
        horizontalScrollBreakpoint={breakpointM}
        paginationProps={{
          currentPage: pageIndex,
          maxPage,
          itemsPerPage,
          nbItemsOptions: [100],
          setItemsPerPage,
          onChangePage: setPageIndex,
        }}
      >
        <TableHeader columns={columns} />
        <FlatList
          data={leaderboard}
          renderItem={({ item }) => (
            <MarketplaceLeaderboardTableRow leaderboardEntry={item} />
          )}
          keyExtractor={(item) => item.userId}
        />
        <SpacerColumn size={2} />
      </TableWrapper>
    </View>
  );
});

const MarketplaceLeaderboardTableRow: React.FC<{
  leaderboardEntry: LeaderboardEntry;
}> = ({ leaderboardEntry }) => {
  return (
    <View>
      <TableRow>
        <TableTextCell
          style={{
            minWidth: columns.rank.minWidth,
            flex: columns.rank.flex,
          }}
        >
          {`${leaderboardEntry.rank}`}
        </TableTextCell>

        <TableCell
          style={{
            minWidth: columns.userId.minWidth,
            flex: columns.userId.flex,
          }}
        >
          <UserNameInline userId={leaderboardEntry.userId} />
        </TableCell>

        <TableTextCell
          style={{
            minWidth: columns.totalXp.minWidth,
            flex: columns.totalXp.flex,
          }}
        >
          {prettyXp(leaderboardEntry.totalXp)}
        </TableTextCell>

        <TableTextCell
          style={{
            minWidth: columns.boost.minWidth,
            flex: columns.boost.flex,
          }}
        >
          {prettyXp(leaderboardEntry.boost)}
        </TableTextCell>

        <TableTextCell
          style={{
            minWidth: columns.mintXp.minWidth,
            flex: columns.mintXp.flex,
          }}
        >
          {prettyXp(leaderboardEntry.mintXp)}
        </TableTextCell>

        <TableTextCell
          style={{
            minWidth: columns.sellXp.minWidth,
            flex: columns.sellXp.flex,
          }}
        >
          {prettyXp(leaderboardEntry.sellXp)}
        </TableTextCell>

        <TableTextCell
          style={{
            minWidth: columns.buyXp.minWidth,
            flex: columns.buyXp.flex,
          }}
        >
          {prettyXp(leaderboardEntry.buyXp)}
        </TableTextCell>
      </TableRow>
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
