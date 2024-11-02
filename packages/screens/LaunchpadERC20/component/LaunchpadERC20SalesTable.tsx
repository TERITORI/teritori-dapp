import React from "react";
import { FlatList, View } from "react-native";

import { useLastSales } from "../hooks/useLastSales";
import { prettyTimestamp, prettyTokenName } from "../utils/prettyText";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { Sale } from "@/utils/launchpadERC20/types";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";

const columns: TableColumns = {
  id: {
    label: "ID",
    flex: 0.65,
    minWidth: 70,
  },
  tokenName: {
    label: "Token Name",
    flex: 0.8,
    minWidth: 140,
  },
  pricePerToken: {
    label: "Price Per Token",
    flex: 0.8,
    minWidth: 110,
  },
  limitPerAddr: {
    label: "Limit Per User",
    flex: 0.8,
    minWidth: 100,
  },
  minGoal: {
    label: "Min. Goal",
    flex: 0.8,
    minWidth: 100,
  },
  maxGoal: {
    label: "Max. Goal",
    flex: 1,
    minWidth: 100,
  },
  startTimestamp: {
    label: "Start Date",
    flex: 1,
    minWidth: 100,
  },
  endTimestamp: {
    label: "End Date",
    flex: 1,
    minWidth: 100,
  },
};

const breakpointM = 800;

interface SalesTableProps {
  networkId: string;
}

export const SalesTable: React.FC<SalesTableProps> = ({ networkId }) => {
  const { data: sales } = useLastSales(networkId);

  return (
    <View
      style={{
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <BrandText>Latest ERC20 Sales Created</BrandText>
      <SpacerColumn size={2} />
      <TableWrapper horizontalScrollBreakpoint={breakpointM}>
        <TableHeader columns={columns} />
        {sales && (
          <FlatList
            data={sales}
            renderItem={({ item }) => <SaleTableRow sale={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
      </TableWrapper>
    </View>
  );
};

const SaleTableRow: React.FC<{
  sale: Sale;
}> = ({ sale }) => {
  return (
    <TableRow>
      <TableTextCell
        style={[
          {
            minWidth: columns.id.minWidth,
            flex: columns.id.flex,
          },
        ]}
      >
        {sale.id}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.tokenName.minWidth,
            flex: columns.tokenName.flex,
          },
        ]}
      >
        {prettyTokenName(sale.tokenName)}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.pricePerToken.minWidth,
            flex: columns.pricePerToken.flex,
          },
        ]}
      >
        {sale.pricePerToken}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.limitPerAddr.minWidth,
            flex: columns.limitPerAddr.flex,
          },
        ]}
      >
        {sale.limitPerAddr}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.minGoal.minWidth,
            flex: columns.minGoal.flex,
          },
        ]}
      >
        {sale.minGoal}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.maxGoal.minWidth,
            flex: columns.maxGoal.flex,
          },
        ]}
      >
        {sale.maxGoal}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.startTimestamp.minWidth,
            flex: columns.startTimestamp.flex,
          },
        ]}
      >
        {prettyTimestamp(sale.startTimestamp)}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.endTimestamp.minWidth,
            flex: columns.endTimestamp.flex,
          },
        ]}
      >
        {prettyTimestamp(sale.endTimestamp)}
      </TableTextCell>
    </TableRow>
  );
};
