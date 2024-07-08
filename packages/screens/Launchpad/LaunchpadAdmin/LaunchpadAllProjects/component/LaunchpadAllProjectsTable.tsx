import React from "react";
import { FlatList, View } from "react-native";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import cryptoLogoSVG from "@/assets/icons/crypto-logo.svg";
import downArrowSVG from "@/assets/icons/downArrow.svg";
import upArrowSVG from "@/assets/icons/upArrow.svg";
import { SVG } from "@/components/SVG";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { DummyLaunchpadProject } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAllProjects/LaunchpadAllProjectsScreen";
import { errorColor, successColor } from "@/utils/style/colors";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";

const columns: TableColumns = {
  rank: {
    label: "#",
    minWidth: 20,
    flex: 0.25,
  },
  collectionName: {
    label: "Collection Name",
    minWidth: 260,
    flex: 3,
  },
  floor: {
    label: "Floor",
    minWidth: 120,
    flex: 1.5,
  },
  totalVol: {
    label: "Total Vol",
    minWidth: 140,
    flex: 1.8,
  },
  vol: {
    label: "24h Vol",
    minWidth: 120,
    flex: 1.5,
  },
  volPercentage: {
    label: "24h Vol %",
    minWidth: 120,
    flex: 1.5,
  },
};

const breakpointM = 860;

export const LaunchpadAllProjectsTable: React.FC<{
  rows: DummyLaunchpadProject[];
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
            <LaunchpadAllProjectsTableRow collection={item} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadAllProjectsTableRow: React.FC<{
  collection: DummyLaunchpadProject;
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
            minWidth: columns.collectionName.minWidth,
            flex: columns.collectionName.flex,
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
          <CellBrandText>{collection.collectionName}</CellBrandText>

          <SVG
            source={checkBadgeSVG}
            width={18}
            height={18}
            style={{ marginLeft: layout.spacing_x1 }}
          />
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.floor.minWidth,
            flex: columns.floor.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG source={cryptoLogoSVG} />
          <CellBrandText style={{ marginLeft: layout.spacing_x1 }}>
            {collection.floor}
          </CellBrandText>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.totalVol.minWidth,
            flex: columns.totalVol.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG source={cryptoLogoSVG} />
          <CellBrandText style={{ marginLeft: layout.spacing_x1 }}>
            {collection.totalVol}
          </CellBrandText>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.vol.minWidth,
            flex: columns.vol.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG source={cryptoLogoSVG} />
          <CellBrandText style={{ marginLeft: layout.spacing_x1 }}>
            {collection.vol}
          </CellBrandText>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.volPercentage.minWidth,
            flex: columns.volPercentage.flex,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {collection.volPercentage.includes("+") ? (
            <SVG source={upArrowSVG} />
          ) : (
            <SVG source={downArrowSVG} />
          )}
          <CellBrandText
            style={{
              marginLeft: layout.spacing_x1,
              color: collection.volPercentage.includes("+")
                ? successColor
                : errorColor,
            }}
          >
            {collection.volPercentage}
          </CellBrandText>
        </TableCell>
      </TableRow>
    </View>
  );
};
