import React from "react";
import { FlatList, View } from "react-native";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import solanaCircleSVG from "@/assets/icons/networks/solana-circle.svg";
import { SVG } from "@/components/SVG";
import { StateBadge } from "@/components/badges/StateBadge";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { getNetwork } from "@/networks";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { collectionStatus } from "@/utils/launchpad";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const columns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  collectionName: {
    label: "Collection Name",
    minWidth: 240,
    flex: 3,
  },
  symbol: {
    label: "Symbol",
    minWidth: 80,
    flex: 0.5,
  },
  collectionNetwork: {
    label: "Collection Network",
    minWidth: 150,
    flex: 1.8,
  },
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
  const network = getNetwork(collection.target_network);

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
            minWidth: columns.collectionName.minWidth,
            flex: columns.collectionName.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <RoundedGradientImage
            size="XS"
            sourceURI={web3ToWeb2URI(collection.cover_img_uri)}
            fallbackURI={defaultCollectionImagePNG}
            style={{
              marginRight: layout.spacing_x1,
            }}
          />
          <CellBrandText>{collection.name}</CellBrandText>

          <SVG
            source={checkBadgeSVG}
            width={18}
            height={18}
            style={{ marginLeft: layout.spacing_x1 }}
          />
        </TableCell>

        <TableTextCell
          style={{
            minWidth: columns.symbol.minWidth,
            flex: columns.symbol.flex,
          }}
        >
          {collection.symbol}
        </TableTextCell>

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

          <CellBrandText>
            {network?.displayName || "UNKNOWN NETWORK"}
          </CellBrandText>
        </TableCell>

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
            <PrimaryButton text="Complete collection" size="XXS" />
          </TableCell>
        )}
      </TableRow>
    </View>
  );
};
