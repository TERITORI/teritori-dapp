// libraries
import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";

import starSVG from "../../../../assets/icons/star.svg";
import { NFTActivityType } from "../../../screens/Marketplace/types";
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

type CollapsableActivitiesProps = object;

export const CollapsableActivities = ({}: CollapsableActivitiesProps) => {
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
            <AddressText numberOfLines={1} ellipsizeMode="head">
              {item.value}
            </AddressText>
          );

        case "transactionType":
          if (item.value?.includes("Sold via")) {
            return <SoldViaText>{item.value}</SoldViaText>;
          } else if (item.value?.includes("Cancel")) {
            return <CancelListingText>{item.value}</CancelListingText>;
          }
          return null;

        default:
          return null;
      }
    },
    []
  );

  return (
    <CollapsableSection icon={starSVG} title="Activities">
      <TableRow headings={Object.values(TABLE_ROWS)} />
      <FlatList
        data={customRowData}
        renderItem={({ item }) => (
          <TableRowData data={item} specialRender={specialRender} />
        )}
      />
      <SpacerColumn size={2} />
      <Pagination currentPage={1} maxPage={2} />
      <SpacerColumn size={2} />
    </CollapsableSection>
  );
};

const AddressText = styled(BrandText)(({ theme: { colors } }) => ({
  ...(fontMedium14 as object),
  color: colors.primary,
}));

const SoldViaText = styled(BrandText)(({ theme: { colors } }) => ({
  ...(fontMedium14 as object),
  color: colors.reef,
}));

const CancelListingText = styled(BrandText)(({ theme: { colors } }) => ({
  ...(fontMedium14 as object),
  color: colors.neutral77,
}));
