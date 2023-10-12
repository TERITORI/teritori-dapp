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
  mineShaftColor,
  primaryColor,
  reefColor,
  neutral77,
} from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ExternalLink } from "../ExternalLink";
import { Pagination } from "../Pagination";
import { SpacerColumn } from "../spacer";
import { TableRowHeading, TableRow } from "../table/TableRow";

const TABLE_ROWS: { [key: string]: TableRowHeading } = {
  transactionId: {
    label: "Transaction ID",
    flex: 3,
  },
  transactionType: {
    label: "Transaction type",
    flex: 3,
  },
  time: {
    label: "Time",
    flex: 3,
  },
  totalAmount: {
    label: "Total amount",
    flex: 3,
  },
  buyer: {
    label: "Buyer",
    flex: 3,
  },
  seller: {
    label: "Seller",
    flex: 3,
  },
};

export const ActivityTable: React.FC<{
  nftId?: string;
  collectionId?: string;
}> = ({ nftId, collectionId }) => {
  const isMobile = useIsMobile();
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const { total, activities } = useActivity({
    collectionId: collectionId || "",
    nftId: nftId || "",
    offset: pageIndex * itemsPerPage,
    limit: itemsPerPage,
  });
  if (isMobile) {
    return null;
  }
  const maxPage = Math.max(Math.ceil(total / itemsPerPage), 1);
  return (
    <View
      style={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <TableRow headings={Object.values(TABLE_ROWS)} />
      <FlatList
        data={activities}
        renderItem={({ item }) => <ActivityRow activity={item} />}
        keyExtractor={(item) => item.id}
        style={{
          minHeight: 248,
          borderTopColor: mineShaftColor,
          borderTopWidth: 1,
        }}
      />
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

const ActivityRow: React.FC<{ activity: Activity }> = ({ activity }) => {
  const [network, txHash] = parseActivityId(activity.id);
  const [, buyerAddress] = parseUserId(activity.buyerId);
  const [, sellerAddress] = parseUserId(activity.sellerId);
  const buyerInfo = useNSUserInfo(activity.buyerId);
  const sellerInfo = useNSUserInfo(activity.sellerId);

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
      <View
        style={{
          flex: TABLE_ROWS.transactionId.flex,
          paddingRight: layout.spacing_x1,
        }}
      >
        <ExternalLink
          externalUrl={txExplorerLink(network?.id, txHash)}
          style={[fontMedium14, { width: "100%" }]}
          ellipsizeMode="middle"
          numberOfLines={1}
        >
          {txHash}
        </ExternalLink>
      </View>
      <BrandText
        style={[
          fontMedium14,
          {
            flex: TABLE_ROWS.transactionType.flex,
            paddingRight: layout.spacing_x1,
          },
          activityNameStyle(activity.transactionKind),
        ]}
      >
        {prettyActivityName(activity.transactionKind)}
      </BrandText>
      <BrandText
        style={[
          fontMedium14,
          { flex: TABLE_ROWS.time.flex, paddingRight: layout.spacing_x1 },
        ]}
      >
        {moment(activity.time).fromNow()}
      </BrandText>
      <BrandText
        style={[
          fontMedium14,
          {
            flex: TABLE_ROWS.totalAmount.flex,
            paddingRight: layout.spacing_x1,
          },
        ]}
      >
        {!!activity.amount &&
          prettyPrice(network?.id || "", activity.amount, activity.denom)}
      </BrandText>
      <View
        style={{ flex: TABLE_ROWS.buyer.flex, paddingRight: layout.spacing_x1 }}
      >
        <Link
          to={`/user/${activity.buyerId}`}
          style={[fontMedium14, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {buyerInfo.metadata?.tokenId || buyerAddress}
        </Link>
      </View>
      <View
        style={{
          flex: TABLE_ROWS.seller.flex,
        }}
      >
        <Link
          to={`/user/${activity.sellerId}`}
          style={[fontMedium14, { color: primaryColor }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {sellerInfo.metadata?.tokenId || sellerAddress}
        </Link>
      </View>
    </View>
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
