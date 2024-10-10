import React from "react";
import { FlatList, View } from "react-native";

import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
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
import { launchpadProjectStatus, parseCollectionData } from "@/utils/launchpad";
import { useAppNavigation } from "@/utils/navigation";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";

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
      <LaunchpadReadyMyCollectionsTableRow
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
          // keyExtractor={keyExtractor}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadReadyMyCollectionsTableRow: React.FC<{
  launchpadProject: LaunchpadProject;
  index: number;
}> = ({ launchpadProject, index }) => {
  const navigation = useAppNavigation();
  const collectionData = parseCollectionData(launchpadProject);
  if (!collectionData) return null;
  return (
    <View>
      <TableRow>
        <LaunchpadTablesCommonColumns
          collectionData={collectionData}
          index={index}
        />

        <TableCell
          style={{
            minWidth: columns.status.minWidth,
            flex: columns.status.flex,
          }}
        >
          <StateBadge text={launchpadProjectStatus(launchpadProject)} />
        </TableCell>

        {launchpadProjectStatus(launchpadProject) === "INCOMPLETE" && (
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
                  id: collectionData.symbol,
                })
              }
            />
          </TableCell>
        )}
      </TableRow>
    </View>
  );
};
