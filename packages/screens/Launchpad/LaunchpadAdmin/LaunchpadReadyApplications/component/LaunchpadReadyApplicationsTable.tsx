import React from "react";
import { FlatList, View } from "react-native";

import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
import { OmniLink } from "@/components/OmniLink";
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
import { launchpadProjectStatus, parseCollectionData } from "@/utils/launchpad";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";

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
  rows: LaunchpadProject[];
}> = ({ rows }) => {
  const renderItem = ({
    item,
    index,
  }: {
    item: LaunchpadProject;
    index: number;
  }) => {
    const collectionData = parseCollectionData(item);
    return (
      <LaunchpadReadyApplicationsTableRow
        launchpadProject={item}
        index={index}
        key={collectionData?.symbol || index}
      />
    );
  };

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
          renderItem={renderItem}
          // keyExtractor={(item) => item.symbol}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadReadyApplicationsTableRow: React.FC<{
  launchpadProject: LaunchpadProject;
  index: number;
}> = ({ launchpadProject, index }) => {
  const collectionData = parseCollectionData(launchpadProject);
  if (!collectionData) return null;
  return (
    <OmniLink
      to={{
        screen: "LaunchpadApplicationReview",
        params: { id: collectionData.symbol },
      }}
    >
      <TableRow>
        <LaunchpadTablesCommonColumns
          collectionData={collectionData}
          index={index}
        />

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
          <StateBadge text={launchpadProjectStatus(launchpadProject)} />
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
    </OmniLink>
  );
};
