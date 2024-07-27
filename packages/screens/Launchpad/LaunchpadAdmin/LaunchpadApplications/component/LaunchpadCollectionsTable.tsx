import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import defaultCollectionImagePNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import externalLinkSVG from "@/assets/icons/external-link.svg";
import solanaCircleSVG from "@/assets/icons/networks/solana-circle.svg";
import { Link } from "@/components/Link";
import { OmniLink } from "@/components/OmniLink";
import { SVG } from "@/components/SVG";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import { getNetwork } from "@/networks";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { secondaryColor } from "@/utils/style/colors";
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
    minWidth: 140,
    flex: 1.8,
  },
  expectedPublicMintPrice: {
    label: "Expected Public Mint Price",
    minWidth: 150,
    flex: 1.8,
  },
  expectedMintDate: {
    label: "Expected Mint Date",
    minWidth: 100,
    flex: 1,
  },
};
const breakpointM = 1110;

// Displays collection_data as CollectionDataResult[] from many launchpad_projects
export const LaunchpadCollectionsTable: React.FC<{
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
            <LaunchpadCollectionsTableRow collection={item} index={index} />
          )}
          keyExtractor={(item) => item.symbol}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadCollectionsTableRow: React.FC<{
  collection: CollectionDataResult;
  index: number;
  // prices: CoingeckoPrices;
}> = ({
  collection,
  index,
  //  prices
}) => {
  const network = getNetwork(collection.target_network);
  return (
    <OmniLink
      to={{
        screen: "LaunchpadApplicationReview",
        params: { id: collection.symbol },
      }}
    >
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
            minWidth: columns.twitterURL.minWidth,
            flex: columns.twitterURL.flex,
          }}
        >
          <Link to={collection.twitter_profile}>
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.discordURL.minWidth,
            flex: columns.discordURL.flex,
          }}
        >
          <Link to={collection.contact_discord_name}>
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableTextCell
          style={{
            flex: columns.expectedTotalSupply.flex,
            minWidth: columns.expectedTotalSupply.minWidth,
          }}
        >
          {`${collection.expected_supply}`}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedPublicMintPrice.flex,
            minWidth: columns.expectedPublicMintPrice.minWidth,
          }}
        >
          {`${collection.expected_public_mint_price}`}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedMintDate.flex,
            minWidth: columns.expectedMintDate.minWidth,
          }}
        >
          {moment(collection.expected_mint_date).format("MMM D YYYY")}
        </TableTextCell>

        {/*TODO: Three dots here with possible actions on the collection ?*/}
        {/*<SVG*/}
        {/*  source={dotsSVG}*/}
        {/*  height={16}*/}
        {/*  width={16}*/}
        {/*  style={{ marginLeft: layout.spacing_x0_5 }}*/}
        {/*/>*/}
      </TableRow>
    </OmniLink>
  );
};
