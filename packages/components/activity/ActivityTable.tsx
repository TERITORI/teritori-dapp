import { Link } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { FlatList, TextStyle, View } from "react-native";

import { Activity } from "../../api/marketplace/v1/marketplace";
import { useActivity } from "../../hooks/useActivity";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseActivityId, parseUserId, txExplorerLink } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import {
  primaryColor,
  reefColor,
  neutral77,
  errorColor,
} from "../../utils/style/colors";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { ExternalLink } from "../ExternalLink";
import { SpacerRow } from "../spacer";

import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { TableRow } from "@/components/table/TableRow";
import { CellBrandText, TableTextCell } from "@/components/table/TableTextCell";
import { TableWrapper } from "@/components/table/TableWrapper";
import { tableCellTextStyle, TableColumns } from "@/components/table/utils";
import { tinyAddress } from "@/utils/text";

const columns: TableColumns = {
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

const breakpointM = 800;

export const ActivityTable: React.FC<{
  nftId?: string;
  collectionId?: string;
}> = ({ nftId, collectionId }) => {
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
      <TableWrapper
        showPagination
        paginationProps={{
          currentPage: pageIndex,
          maxPage,
          itemsPerPage,
          nbItemsOptions: [50, 100, 200],
          setItemsPerPage,
          onChangePage: setPageIndex,
        }}
        horizontalScrollBreakpoint={breakpointM}
      >
        <TableHeader columns={columns} />
        <FlatList
          data={activities}
          renderItem={({ item }) => <ActivityTableRow activity={item} />}
          keyExtractor={(item) => item.id}
        />
      </TableWrapper>
    </View>
  );
};

const ActivityTableRow: React.FC<{
  activity: Activity;
}> = ({ activity }) => {
  const isMobile = useIsMobile();
  const [network, txHash] = parseActivityId(activity.id);
  const [, buyerAddress] = parseUserId(activity.buyerId);
  const [, sellerAddress] = parseUserId(activity.sellerId);
  const buyerInfo = useNSUserInfo(activity.buyerId);
  const sellerInfo = useNSUserInfo(activity.sellerId);
  const hasAmount = !!(activity.amount && activity.amount !== "0");

  return (
    <TableRow>
      <TableCell
        style={{
          minWidth: columns.transactionId.minWidth,
          flex: columns.transactionId.flex,
        }}
      >
        <ExternalLink
          externalUrl={txExplorerLink(network?.id, txHash)}
          style={[tableCellTextStyle, { width: "100%" }]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {tinyAddress(txHash, 12)}
        </ExternalLink>
      </TableCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.transactionType.minWidth,
            flex: columns.transactionType.flex,
          },
          activityNameStyle(activity.transactionKind),
        ]}
      >
        {prettyActivityName(activity.transactionKind)}
      </TableTextCell>

      <TableTextCell
        style={[
          {
            minWidth: columns.time.minWidth,
            flex: columns.time.flex,
          },
        ]}
      >
        {moment(activity.time).fromNow()}
      </TableTextCell>

      <TableCell
        style={{
          flexDirection: "row",
          alignItems: "center",
          minWidth: columns.totalAmount.minWidth,
          flex: columns.totalAmount.flex,
          marginRight: isMobile ? layout.spacing_x1 : layout.spacing_x1_5,
        }}
      >
        <CellBrandText>
          {hasAmount
            ? `${prettyPrice(network?.id || "", activity.amount, activity.denom)}`
            : ""}
        </CellBrandText>
        <SpacerRow size={1} />
        <CellBrandText style={{ color: neutral77 }}>
          {hasAmount ? `≈ $${activity.usdPrice.toFixed(2)}` : ""}
        </CellBrandText>
      </TableCell>

      <TableCell
        style={{
          minWidth: columns.buyer.minWidth,
          flex: columns.buyer.flex,
        }}
      >
        <Link
          to={`/user/${activity.buyerId}`}
          style={[tableCellTextStyle, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {buyerInfo.metadata?.tokenId || tinyAddress(buyerAddress, 18)}
        </Link>
      </TableCell>

      <TableCell
        style={{
          minWidth: columns.seller.minWidth,
          flex: columns.seller.flex,
        }}
      >
        <Link
          to={`/user/${activity.sellerId}`}
          style={[tableCellTextStyle, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {sellerInfo.metadata?.tokenId || tinyAddress(sellerAddress, 18)}
        </Link>
      </TableCell>
    </TableRow>
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
