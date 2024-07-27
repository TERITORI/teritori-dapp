import React from "react";
import { FlatList, View } from "react-native";

import { StateBadge } from "@/components/badges/StateBadge";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import {
  commonColumns,
  LaunchpadTablesCommonColumns,
} from "@/screens/Launchpad/components/LaunchpadTablesCommonColumns";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const columns: TableColumns = {
  ...commonColumns,
  projectReadinessForMint: {
    label: "Project Readiness for Mint",
    minWidth: 200,
    flex: 2,
  },
  whitelistQuantity: {
    label: "Whitelist quantity",
    minWidth: 100,
    flex: 1,
  },
  premiumMarketingPackage: {
    label: "Premium marketing package",
    minWidth: 160,
    flex: 1.8,
  },
  basicMarketingPackage: {
    label: "Basic marketing package",
    minWidth: 140,
    flex: 1.2,
  },
};

const breakpointM = 1120;

export const LaunchpadReadyApplicationsTable: React.FC<{
  rows: CollectionDataResult[];
}> = ({ rows }) => {
  return (
    <View
      style={{
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableWrapper horizontalScrollBreakpoint={breakpointM}>
        <TableHeader columns={columns} />
        <FlatList
          data={rows}
          renderItem={({ item, index }) => (
            <LaunchpadReadyApplicationsTableRow
              collection={item}
              index={index}
            />
          )}
          keyExtractor={(item) => item.symbol}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadReadyApplicationsTableRow: React.FC<{
  collection: CollectionDataResult;
  index: number;
}> = ({ collection, index }) => {
  return (
    <View>
      <TableRow>
        <LaunchpadTablesCommonColumns collection={collection} index={index} />

        {/*TODO: "Project readiness for mint", "Whitelist quantity", "Premium marketing package", "Basic marketing package"*/}

        <TableCell
          style={{
            minWidth: columns.projectReadinessForMint.minWidth,
            flex: columns.projectReadinessForMint.flex,
          }}
        >
          <StateBadge text="TODO" />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.whitelistQuantity.minWidth,
            flex: columns.whitelistQuantity.flex,
          }}
        >
          <StateBadge text="TODO" />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.premiumMarketingPackage.minWidth,
            flex: columns.premiumMarketingPackage.flex,
          }}
        >
          <StateBadge text="TODO" />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.basicMarketingPackage.minWidth,
            flex: columns.basicMarketingPackage.flex,
          }}
        >
          <StateBadge text="TODO" />
        </TableCell>
      </TableRow>
    </View>
  );
};
