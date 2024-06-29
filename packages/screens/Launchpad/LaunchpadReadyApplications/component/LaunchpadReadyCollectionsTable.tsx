import React from "react";
import { FlatList, View } from "react-native";

import { CellBadgeRow } from "./CellBadgeRow";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import solanaCircleSVG from "@/assets/icons/networks/solana-circle.svg";
import { SVG } from "@/components/SVG";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { DummyLaunchpadReadyCollection } from "@/screens/Launchpad/LaunchpadReadyApplications/LaunchpadReadyApplicationsScreen";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";

const columns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  collectionNameData: {
    label: "Collection Name",
    minWidth: 260,
    flex: 3,
  },
  collectionNetwork: {
    label: "Collection Network",
    minWidth: 160,
    flex: 1.8,
  },
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

export const LaunchpadReadyCollectionsTable: React.FC<{
  rows: DummyLaunchpadReadyCollection[]; //TODO: Type this
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
          keyExtractor={(item) => item.id.toString()}
        />
        <SpacerColumn size={16} />
      </TableWrapper>
    </View>
  );
};

const LaunchpadReadyApplicationsTableRow: React.FC<{
  collection: DummyLaunchpadReadyCollection;
  index: number;
  // prices: CoingeckoPrices;
}> = ({
  collection,
  index,
  //  prices
}) => {
  return (
    <View>
      <TableRow>
        <TableTextCell
          style={{
            minWidth: columns.rank.minWidth,
            flex: columns.rank.flex,
          }}
        >
          {`${index + 1}`}
        </TableTextCell>

        <TableCell
          style={{
            minWidth: columns.collectionNameData.minWidth,
            flex: columns.collectionNameData.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <RoundedGradientImage
            size="XS"
            sourceURI={defaultCollectionImagePNG}
            style={{
              marginRight: layout.spacing_x1,
            }}
          />
          <CellBrandText>{collection.collectionNameData}</CellBrandText>

          <SVG
            source={checkBadgeSVG}
            width={18}
            height={18}
            style={{ marginLeft: layout.spacing_x1 }}
          />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.collectionNetwork.minWidth,
            flex: columns.collectionNetwork.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG
            source={solanaCircleSVG}
            width={18}
            height={18}
            style={{ marginRight: layout.spacing_x1 }}
          />

          <CellBrandText>{collection.collectionNetwork}</CellBrandText>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.projectReadinessForMint.minWidth,
            flex: columns.projectReadinessForMint.flex,
          }}
        >
          <CellBadgeRow
            style={{ flex: columns.projectReadinessForMint.flex }}
            text={collection.projectReadinessForMint}
          />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.whitelistQuantity.minWidth,
            flex: columns.whitelistQuantity.flex,
          }}
        >
          <CellBadgeRow
            style={{ flex: columns.whitelistQuantity.flex }}
            text={collection.whitelistQuantity}
          />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.premiumMarketingPackage.minWidth,
            flex: columns.premiumMarketingPackage.flex,
          }}
        >
          <CellBadgeRow
            style={{ flex: columns.premiumMarketingPackage.flex }}
            text={collection.premiumMarketingPackage}
          />
        </TableCell>

        <TableTextCell
          style={{
            minWidth: columns.basicMarketingPackage.minWidth,
            flex: columns.basicMarketingPackage.flex,
          }}
        >
          {collection.basicMarketingPackage}
        </TableTextCell>
      </TableRow>
    </View>
  );
};
