import React from "react";
import { FlatList, View } from "react-native";

import { useLastAirdrops } from "../hooks/useLastAirdrops";
import {
  PrettyTimestamp,
  PrettyTokenName,
  PrettyTokenSymbol,
} from "../utils/prettyText";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { Airdrop } from "@/utils/launchpadERC20/types";
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
  tokenSymbol: {
    label: "Token Symbol",
    flex: 0.8,
    minWidth: 110,
  },
  amountPerAddr: {
    label: "Amount Per User",
    flex: 0.8,
    minWidth: 100,
  },
  startTimestamp: {
    label: "Start Date",
    flex: 1,
    minWidth: 140,
  },
  endTimestamp: {
    label: "End Date",
    flex: 1,
    minWidth: 140,
  },
};

const breakpointM = 800;

interface AirdropsTableProps {
  networkId: string;
}

export const AirdropsTable: React.FC<AirdropsTableProps> = ({ networkId }) => {
  const { data: airdrops } = useLastAirdrops(networkId);

  return (
    <View
      style={{
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <BrandText>Latest ERC20 Airdrops Created</BrandText>
      <SpacerColumn size={2} />
      <TableWrapper
        paginationProps={{
          currentPage: 0,
          maxPage: 1,
          itemsPerPage: 10,
          nbItemsOptions: [],
          setItemsPerPage: () => {},
          onChangePage: () => {},
        }}
        horizontalScrollBreakpoint={breakpointM}
      >
        <TableHeader columns={columns} />
        {airdrops && (
          <FlatList
            data={airdrops}
            renderItem={({ item }) => <AidropTableRow airdrop={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
      </TableWrapper>
    </View>
  );
};

const AidropTableRow: React.FC<{
  airdrop: Airdrop;
}> = ({ airdrop }) => {
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
        {airdrop.id}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.tokenName.minWidth,
            flex: columns.tokenName.flex,
          },
        ]}
      >
        {PrettyTokenName(airdrop.tokenName)}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.tokenSymbol.minWidth,
            flex: columns.tokenSymbol.flex,
          },
        ]}
      >
        {PrettyTokenSymbol(airdrop.tokenSymbol)}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.amountPerAddr.minWidth,
            flex: columns.amountPerAddr.flex,
          },
        ]}
      >
        {airdrop.amountPerAddr + " " + airdrop.tokenSymbol}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.startTimestamp.minWidth,
            flex: columns.startTimestamp.flex,
          },
        ]}
      >
        {PrettyTimestamp(airdrop.startTimestamp)}
      </TableTextCell>
      <TableTextCell
        style={[
          {
            minWidth: columns.endTimestamp.minWidth,
            flex: columns.endTimestamp.flex,
          },
        ]}
      >
        {PrettyTimestamp(airdrop.endTimestamp)}
      </TableTextCell>
    </TableRow>
  );
};
