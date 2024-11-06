import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import {
  commonColumns,
  LaunchpadTablesCommonColumns,
} from "../../LaunchpadApply/LaunchpadCreate/components/LaunchpadTablesCommonColumns";

import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
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
import { parseCollectionData } from "@/utils/launchpad";
import { secondaryColor } from "@/utils/style/colors";
import { screenContentMaxWidthLarge } from "@/utils/style/layout";

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
      <LaunchpadCollectionsTableRow
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
          // keyExtractor={(item) => item.symbol}
        />
      </TableWrapper>
    </View>
  );
};

const LaunchpadCollectionsTableRow: React.FC<{
  launchpadProject: LaunchpadProject;
  index: number;
}> = ({ launchpadProject, index }) => {
  const collectionData = parseCollectionData(launchpadProject);
  if (!collectionData) return null;
  return (
    <OmniLink
      to={{
        screen: "LaunchpadApplicationReview",
        params: { id: launchpadProject.id },
      }}
    >
      {/* <View> */}
      <TableRow>
        <LaunchpadTablesCommonColumns
          collectionData={collectionData}
          index={index}
        />

        <TableCell
          style={{
            minWidth: columns.twitterURL.minWidth,
            flex: columns.twitterURL.flex,
          }}
        >
          {/* <Link to={collectionData.twitter_profile}> */}
          <Link to="">
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableCell
          style={{
            minWidth: columns.discordURL.minWidth,
            flex: columns.discordURL.flex,
          }}
        >
          {/* <Link to={collectionData.contact_discord_name}> */}
          <Link to="">
            <SVG source={externalLinkSVG} color={secondaryColor} />
          </Link>
        </TableCell>

        <TableTextCell
          style={{
            flex: columns.expectedTotalSupply.flex,
            minWidth: columns.expectedTotalSupply.minWidth,
          }}
        >
          {`${collectionData.expected_supply}`}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedPublicMintPrice.flex,
            minWidth: columns.expectedPublicMintPrice.minWidth,
          }}
        >
          {`${collectionData.expected_public_mint_price}`}
        </TableTextCell>

        <TableTextCell
          style={{
            flex: columns.expectedMintDate.flex,
            minWidth: columns.expectedMintDate.minWidth,
          }}
        >
          {moment(collectionData.expected_mint_date).format("MMM D YYYY")}
        </TableTextCell>

        {/*TODO: Three dots here with possible actions on the collection ?*/}
        {/*<SVG*/}
        {/*  source={dotsSVG}*/}
        {/*  height={16}*/}
        {/*  width={16}*/}
        {/*  style={{ marginLeft: layout.spacing_x0_5 }}*/}
        {/*/>*/}
      </TableRow>
      {/* </View> */}
    </OmniLink>
  );
};
