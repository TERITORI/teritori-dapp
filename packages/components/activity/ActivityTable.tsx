import { Link } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { FlatList, ScrollView, TextStyle, View } from "react-native";

import { Activity } from "../../api/marketplace/v1/marketplace";
import { useActivity } from "../../hooks/useActivity";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseActivityId, parseUserId, txExplorerLink } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import {
  mineShaftColor,
  primaryColor,
  reefColor,
  neutral77,
  errorColor,
} from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { Pagination } from "../Pagination";
import { SpacerColumn } from "../spacer";

import { TableColumns } from "@/components/table/TableHeader";
import { TableScrollableHeader } from "@/components/table/TableScrollableHeader";
import { TableScrollableRow } from "@/components/table/TableScrollableRow";
import { TableStaticHeader } from "@/components/table/TableStaticHeader";
import { TableStaticRow } from "@/components/table/TableStaticRow";
import { TableTextCell } from "@/components/table/TableTextCell";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { tinyAddress } from "@/utils/text";

const staticColumns: TableColumns = {
  transactionId: {
    label: "Transaction ID",
    flex: 0.65,
    minWidth: 110,
  },
  transactionType: {
    label: "Type",
    flex: 0.65,
    minWidth: 140,
  },
};

const scrollableColumns: TableColumns = {
  time: {
    label: "Time",
    flex: 0.65,
    minWidth: 100,
  },
  totalAmount: {
    label: "Total amount",
    flex: 1.5,
    minWidth: 180,
  },
  buyer: {
    label: "Buyer",
    flex: 1.25,
    minWidth: 140,
  },
  seller: {
    label: "Seller",
    flex: 1.25,
    minWidth: 140,
  },
};

const breakpointM = 740;

export const ActivityTable: React.FC<{
  nftId?: string;
  collectionId?: string;
}> = ({ nftId, collectionId }) => {
  const { width } = useMaxResolution();
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const { total, activities } = useActivity({
    collectionId: collectionId || "",
    nftId: nftId || "",
    offset: pageIndex * itemsPerPage,
    limit: itemsPerPage,
  });
  const maxPage = Math.max(Math.ceil(total / itemsPerPage), 1);

  return (
    <View
      style={{
        width: "100%",
        maxWidth: screenContentMaxWidthLarge,
      }}
    >
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View
          style={{
            maxWidth: 264,
          }}
        >
          <TableStaticHeader staticColumns={staticColumns} />

          <FlatList
            data={activities}
            renderItem={({ item }) => (
              <ActivityTableStaticRow activity={item} />
            )}
            keyExtractor={(item) => item.id}
            style={{
              minHeight: 248,
              borderTopColor: mineShaftColor,
              borderTopWidth: 1,
            }}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[width >= breakpointM && { width: "100%" }]}
        >
          <View
            style={{
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <TableScrollableHeader scrollableColumns={scrollableColumns} />

            <FlatList
              data={activities}
              renderItem={({ item }) => (
                <ActivityTableScrollableRow activity={item} />
              )}
              keyExtractor={(item) => item.id}
              style={{
                minHeight: 248,
                width: "100%",
                borderTopColor: mineShaftColor,
                borderTopWidth: 1,
              }}
            />
          </View>
        </ScrollView>
      </View>

      <SpacerColumn size={2} />
      <Pagination
        currentPage={pageIndex}
        maxPage={maxPage}
        itemsPerPage={itemsPerPage}
        dropdownOptions={[50, 100, 200]}
        setItemsPerPage={setItemsPerPage}
        onChangePage={setPageIndex}
      />
      <SpacerColumn size={2} />
    </View>
  );
};

const ActivityTableStaticRow: React.FC<{
  activity: Activity;
}> = ({ activity }) => {
  const [network, txHash] = parseActivityId(activity.id);

  return (
    <TableStaticRow>
      <View
        style={{
          minWidth: staticColumns.transactionId.minWidth,
          flex: staticColumns.transactionId.flex,
          marginRight: layout.spacing_x1,
        }}
      >
        <ExternalLink
          externalUrl={txExplorerLink(network?.id, txHash)}
          style={[fontMedium14, { width: "100%" }]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {tinyAddress(txHash, 12)}
        </ExternalLink>
      </View>

      <TableTextCell
        style={[
          {
            minWidth: staticColumns.transactionType.minWidth,
            flex: staticColumns.transactionType.flex,
          },
          activityNameStyle(activity.transactionKind),
        ]}
      >
        {prettyActivityName(activity.transactionKind)}
      </TableTextCell>
    </TableStaticRow>
  );
};

const ActivityTableScrollableRow: React.FC<{
  activity: Activity;
}> = ({ activity }) => {
  const isMobile = useIsMobile();

  const [network] = parseActivityId(activity.id);
  const [, buyerAddress] = parseUserId(activity.buyerId);
  const [, sellerAddress] = parseUserId(activity.sellerId);
  const buyerInfo = useNSUserInfo(activity.buyerId);
  const sellerInfo = useNSUserInfo(activity.sellerId);

  const hasAmount = !!(activity.amount && activity.amount !== "0");

  return (
    <TableScrollableRow>
      <TableTextCell
        style={[
          {
            minWidth: scrollableColumns.time.minWidth,
            flex: scrollableColumns.time.flex,
          },
        ]}
      >
        {moment(activity.time).fromNow()}
      </TableTextCell>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          minWidth: scrollableColumns.totalAmount.minWidth,
          flex: scrollableColumns.totalAmount.flex,
          marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x1_5,
        }}
      >
        <BrandText style={[fontMedium14, { marginRight: layout.spacing_x1 }]}>
          {hasAmount &&
            `${prettyPrice(network?.id || "", activity.amount, activity.denom)}`}
        </BrandText>
        <BrandText style={[fontMedium14, { color: neutral77 }]}>
          {hasAmount && `≈ $${activity.usdPrice.toFixed(2)}`}
        </BrandText>
      </View>

      <View
        style={{
          marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x1_5,
          minWidth: scrollableColumns.buyer.minWidth,
          flex: scrollableColumns.buyer.flex,
        }}
      >
        <Link
          to={`/user/${activity.buyerId}`}
          style={[fontMedium14, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {buyerInfo.metadata?.tokenId || tinyAddress(buyerAddress, 18)}
        </Link>
      </View>

      <View
        style={{
          marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x1_5,
          minWidth: scrollableColumns.seller.minWidth,
          flex: scrollableColumns.seller.flex,
        }}
      >
        <Link
          to={`/user/${activity.sellerId}`}
          style={[fontMedium14, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {sellerInfo.metadata?.tokenId || tinyAddress(sellerAddress, 18)}
        </Link>
      </View>
    </TableScrollableRow>
  );
};

const prettyActivityName = (kind: string) => {
  switch (kind) {
    case "mint":
      return "Mint";
    case "list":
      return "List";
    case "trade":
      return "Trade";
    case "cancel-listing":
      return "Cancel listing";
    case "update-nft-price":
      return "Update price";
    case "send-nft":
      return "Transfer to contract";
    case "transfer-nft":
      return "Transfer";
    case "burn":
      return "Burn";
    default:
      return kind;
  }
};

const activityNameStyle = (kind: string): TextStyle => {
  switch (kind) {
    case "burn":
      return {
        color: errorColor,
      };
    case "mint":
      return {
        color: primaryColor,
      };
    case "trade":
      return {
        color: reefColor,
      };
    case "cancel-listing":
      return {
        color: neutral77,
      };
    default:
      return {};
  }
};
