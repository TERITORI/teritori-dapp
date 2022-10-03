// libraries
import React, { useCallback, useMemo } from "react";
import { StyleSheet, FlatList } from "react-native";

import starSVG from "../../../../assets/icons/star.svg";
import { NFTActivityType } from "../../../screens/Marketplace/types";
import {
  neutral77,
  primaryColor,
  reefColor,
} from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { Pagination } from "../../Pagination";
import { CollapsableSection } from "../../collapsable/CollapsableSection";
import { SpacerColumn } from "../../spacer";
import {
  TableRow,
  TableRowData,
  TableRowDataItem,
  TableRowHeading,
} from "../../table";
import data from "../nftActivitiesData.json";

const TABLE_ROWS: { [key in keyof NFTActivityType]: TableRowHeading } = {
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

export const CollapsableActivities = () => {
  // variables
  const customRowData = useMemo(
    (): TableRowDataItem[][] =>
      data.map((d) =>
        Object.keys(d).map((k) => ({
          value: d[k as keyof typeof d],
          keyId: k,
          flex: TABLE_ROWS[k as keyof typeof d].flex,
          uid: d.transactionId,
        }))
      ),
    [data]
  );

  // hooks

  // functions

  // returns

  const specialRender = useCallback(
    (item: TableRowDataItem<NFTActivityType>) => {
      switch (item.keyId) {
        case "buyer":
        case "seller":
        case "transactionId":
          return (
            <BrandText
              style={styles.addressText}
              numberOfLines={1}
              ellipsizeMode="head"
            >
              {item.value}
            </BrandText>
          );

        case "transactionType":
          if (item.value?.includes("Sold via")) {
            return (
              <BrandText style={styles.soldViaText}>{item.value}</BrandText>
            );
          } else if (item.value?.includes("Cancel")) {
            return (
              <BrandText style={styles.cancelListingText}>
                {item.value}
              </BrandText>
            );
          }
          return null;

        default:
          return null;
      }
    },
    []
  );

  return (
    // TODO: add white color to svg after implementing color change in SVG component
    <CollapsableSection icon={starSVG} title="Activities">
      <TableRow headings={Object.values(TABLE_ROWS)} />
      <FlatList
        data={customRowData}
        renderItem={({ item }) => (
          <TableRowData data={item} specialRender={specialRender} />
        )}
        keyExtractor={(item, index) => (item.length + index).toString()}
      />
      <SpacerColumn size={2} />
      <Pagination currentPage={1} maxPage={2} />
      <SpacerColumn size={2} />
    </CollapsableSection>
  );
};

const styles = StyleSheet.create({
  addressText: {
    ...(fontMedium14 as object),
    color: primaryColor,
  },

  soldViaText: {
    ...(fontMedium14 as object),
    color: reefColor,
  },

  cancelListingText: {
    ...(fontMedium14 as object),
    color: neutral77,
  },
});
