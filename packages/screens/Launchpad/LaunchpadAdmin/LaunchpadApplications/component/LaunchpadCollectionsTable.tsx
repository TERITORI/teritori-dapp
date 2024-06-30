import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import externalLinkSVG from "@/assets/icons/external-link.svg";
import solanaCircleSVG from "@/assets/icons/networks/solana-circle.svg";
import { Link } from "@/components/Link";
import { SVG } from "@/components/SVG";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn } from "@/components/spacer";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { DummyLaunchpadCollection } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/LaunchpadAdministrationOverviewScreen";
import { secondaryColor } from "@/utils/style/colors";
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
  twitterURL: {
    label: "Twitter",
    minWidth: 60,
    flex: 0.25,
  },
  discordURL: {
    label: "Discord",
    minWidth: 60,
    flex: 0.25,
  },
  expectedTotalSupply: {
    label: "Expected Total Supply",
    minWidth: 160,
    flex: 1.8,
  },
  expectedPublicMintPrice: {
    label: "Expected Public Mint Price",
    minWidth: 160,
    flex: 1.8,
  },
  expectedMintDate: {
    label: "Expected Mint Date",
    minWidth: 100,
    flex: 1,
  },
};
const breakpointM = 1092;

export const LaunchpadCollectionsTable: React.FC<{
  rows: DummyLaunchpadCollection[]; //TODO: Type this
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
            <LaunchpadCollectionsTableRow collection={item} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <SpacerColumn size={16} />
      </TableWrapper>
    </View>
  );
};

const LaunchpadCollectionsTableRow: React.FC<{
  collection: DummyLaunchpadCollection;
  index: number;
  // prices: CoingeckoPrices;
}> = ({
  collection,
  index,
  //  prices
}) => {
  return (
    // <OmniLink
    //   disabled={!target}
    //   to={{
    //     screen: "MyCollection",
    //     params: { id: collection.id },
    //   }}
    // >
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
            minWidth: columns.twitterURL.minWidth,
            flex: columns.twitterURL.flex,
          }}
        >
          <Link to={collection.twitterURL}>
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.discordURL.minWidth,
            flex: columns.discordURL.flex,
          }}
        >
          <Link to={collection.discordURL}>
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableTextCell
          style={{
            flex: columns.expectedTotalSupply.flex,
            minWidth: columns.expectedTotalSupply.minWidth,
          }}
        >
          {`${collection.expectedTotalSupply}`}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedPublicMintPrice.flex,
            minWidth: columns.expectedPublicMintPrice.minWidth,
          }}
        >
          {collection.expectedPublicMintPrice}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedMintDate.flex,
            minWidth: columns.expectedMintDate.minWidth,
          }}
        >
          {moment(collection.expectedMintDate).format("MMM D YYYY")}
        </TableTextCell>

        {/*TODO: Three dots here with possible actions on the collection ?*/}
        {/*<SVG*/}
        {/*  source={dotsSVG}*/}
        {/*  height={16}*/}
        {/*  width={16}*/}
        {/*  style={{ marginLeft: layout.spacing_x0_5 }}*/}
        {/*/>*/}
      </TableRow>
    </View>
    // </OmniLink>
  );
};
