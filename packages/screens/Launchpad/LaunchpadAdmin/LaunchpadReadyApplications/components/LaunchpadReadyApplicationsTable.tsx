import React from "react";
import { FlatList, View } from "react-native";

import {
  commonColumns,
  LaunchpadTablesCommonColumns,
} from "../../../LaunchpadApply/LaunchpadCreate/components/LaunchpadTablesCommonColumns";
import { StatusBadge } from "../../../components/StatusBadge";

import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
import { OmniLink } from "@/components/OmniLink";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { parseCollectionData } from "@/utils/launchpad";
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
        params: { id: launchpadProject.id },
      }}
    >
      <TableRow>
        <LaunchpadTablesCommonColumns
          collectionData={collectionData}
          index={index}
        />

        <CellBrandText>TODO</CellBrandText>

        <TableCell
          style={{
            minWidth: columns.whitelistQuantity.minWidth,
            flex: columns.whitelistQuantity.flex,
          }}
        >
          <StatusBadge projectStatus={launchpadProject.status} />
        </TableCell>

        <CellBrandText>TODO</CellBrandText>

        <CellBrandText>TODO</CellBrandText>
      </TableRow>
    </OmniLink>
  );
};
