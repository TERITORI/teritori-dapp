import React from "react";
import { FlatList, View } from "react-native";

import { StateBadge } from "@/components/badges/StateBadge";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import {
  commonColumns,
  LaunchpadTablesCommonColumns,
} from "@/screens/Launchpad/components/LaunchpadTablesCommonColumns";
import { collectionStatus } from "@/utils/launchpad";
import { useAppNavigation } from "@/utils/navigation";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const columns: TableColumns = {
  ...commonColumns,
  status: {
    label: "Status",
    minWidth: 200,
    flex: 2,
  },
  cta: {
    label: "",
    minWidth: 180,
    flex: 2,
  },
};

const breakpointM = 1120;

export const LaunchpadMyCollectionsTable: React.FC<{
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
            <LaunchpadReadyMyCollectionsTableRow
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

const LaunchpadReadyMyCollectionsTableRow: React.FC<{
  collection: CollectionDataResult;
  index: number;
}> = ({ collection, index }) => {
  const navigation = useAppNavigation();
  return (
    <View>
      <TableRow>
        <LaunchpadTablesCommonColumns collection={collection} index={index} />

        <TableCell
          style={{
            minWidth: columns.status.minWidth,
            flex: columns.status.flex,
          }}
        >
          <StateBadge text={collectionStatus(collection)} />
        </TableCell>

        {collectionStatus(collection) === "INCOMPLETE" && (
          <TableCell
            style={{
              minWidth: columns.cta.minWidth,
              flex: columns.cta.flex,
            }}
          >
            <PrimaryButton
              text="Complete collection"
              size="XXS"
              onPress={() =>
                navigation.navigate("LaunchpadComplete", {
                  id: collection.symbol,
                })
              }
            />
          </TableCell>
        )}
      </TableRow>
    </View>
  );
};
