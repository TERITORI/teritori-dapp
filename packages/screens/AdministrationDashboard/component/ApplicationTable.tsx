import moment from "moment";
import React from "react";
import { FlatList, View } from "react-native";

import dotsSVG from "../../../../assets/icons/dots.svg";

import { SVG } from "@/components/SVG";
import { CollectionNameCell } from "@/components/applicationTable/CollectionNameCell";
import { InnerCellText } from "@/components/applicationTable/InnerCellText";
import { LinkIconAndRedirect } from "@/components/applicationTable/LinkIconAndRedirect";
import { TableHeader } from "@/components/table/TableHeader";
import { TableColumns } from "@/components/table/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { mineShaftColor } from "@/utils/style/colors";
import { layout, screenContentMaxWidthLarge } from "@/utils/style/layout";

const TABLE_COLUMNS: TableColumns = {
  rank: {
    label: "#",
    flex: 1,
  },
  collectionNameData: {
    label: "Collection Name",
    flex: 5,
  },
  collectionNetwork: {
    label: "Collection Network",
    flex: 3,
  },
  TwitterURL: {
    label: "Twitter URL",
    flex: 2,
  },
  DiscordURL: {
    label: "Discord URL",
    flex: 2,
  },
  expectedTotalSupply: {
    label: "Expected Total Supply",
    flex: 3,
  },
  expectedPublicMintPrice: {
    label: "Expected Public Mint Price",
    flex: 3,
  },
  expectedMintDate: {
    label: "Expected Mint Date",
    flex: 3,
  },
};

export const ApplicationTable: React.FC<{
  rows: any[]; // currently i don't know the data types will change it once i will work on functionality
}> = ({ rows }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        justifyContent: "space-between",
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <TableHeader
        style={{
          paddingHorizontal: layout.spacing_x2_5,
        }}
        columns={
          !isMobile
            ? TABLE_COLUMNS
            : Object.fromEntries(Object.entries(TABLE_COLUMNS).slice(0, -5))
        }
      />

      <FlatList
        data={rows}
        renderItem={({ item }) => <ApplicationRowData rowData={item} />}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 220,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
      />
    </View>
  );
};

const ApplicationRowData: React.FC<{ rowData: any }> = ({ rowData }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderColor: mineShaftColor,
        borderBottomWidth: 1,
        paddingVertical: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x2_5,
      }}
    >
      <InnerCellText style={{ flex: TABLE_COLUMNS.rank.flex }}>
        {rowData.rank}
      </InnerCellText>
      <CollectionNameCell
        rowData={rowData}
        style={{ flex: TABLE_COLUMNS.collectionNameData.flex }}
      />
      <InnerCellText
        isSolanaIcon
        style={{
          flex: TABLE_COLUMNS.collectionNetwork.flex,
        }}
      >
        {rowData["collectionNetwork"]}
      </InnerCellText>
      {!isMobile && (
        <>
          <LinkIconAndRedirect
            value={rowData.TwitterURL}
            style={{ flex: TABLE_COLUMNS.TwitterURL.flex }}
          />
          <LinkIconAndRedirect
            value={rowData.DiscordURL}
            style={{ flex: TABLE_COLUMNS.DiscordURL.flex }}
          />
          <InnerCellText
            style={{
              flex: TABLE_COLUMNS.expectedTotalSupply.flex,
            }}
          >
            {rowData.expectedTotalSupply}
          </InnerCellText>
          <InnerCellText
            style={{ flex: TABLE_COLUMNS.expectedPublicMintPrice.flex }}
          >
            {rowData.expectedPublicMintPrice}
          </InnerCellText>
          <View
            style={{
              flex: TABLE_COLUMNS.expectedMintDate.flex,
              flexDirection: "row",
            }}
          >
            <InnerCellText style={{ flex: 1 }}>
              {moment(rowData.expectedMintDate).format("MMM D YYYY")}
            </InnerCellText>
            <SVG
              source={dotsSVG}
              height={16}
              width={16}
              style={{ marginLeft: layout.spacing_x0_5 }}
            />
          </View>
        </>
      )}
    </View>
  );
};
