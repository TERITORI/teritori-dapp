import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import externalLinkSVG from "@/assets/icons/external-link.svg";
import { Link } from "@/components/Link";
import { OmniLink } from "@/components/OmniLink";
import { SVG } from "@/components/SVG";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { TableColumns } from "@/components/table/utils";
import {
  commonColumns,
  LaunchpadTablesCommonColumns,
} from "@/screens/Launchpad/components/LaunchpadTablesCommonColumns";
import { secondaryColor } from "@/utils/style/colors";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const columns: TableColumns = {
  ...commonColumns,
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
  return (
    <OmniLink
      to={{
        screen: "LaunchpadApplicationReview",
        params: { id: collection.symbol },
      }}
    >
      <TableRow>
        <LaunchpadTablesCommonColumns collection={collection} index={index} />

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
