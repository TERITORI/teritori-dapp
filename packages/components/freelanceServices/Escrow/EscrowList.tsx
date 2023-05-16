import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {mineShaftColor} from "../../../utils/style/colors";
import {fontSemibold13} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { EscrowInfo } from "../../../utils/types/freelance";
import { BrandText } from "../../BrandText";
import { SpacerRow } from "../../spacer";
import { TableRow, TableRowHeading } from "../../table";

const TABLE_ROWS: { [key in string]: TableRowHeading } = {
  sender: {
    label: "Sender",
    flex: 3,
  },
  receiver: {
    label: "Receiver",
    flex: 3,
  },
  amount: {
    label: "Amount",
    flex: 2,
  },
  expireAt: {
    label: "Expire At",
    flex: 1,
  },
  status: {
    label: "Status",
    flex: 1,
  },
};

export const EscrowTable: React.FC<{
  escrows: EscrowInfo[];
  style?: StyleProp<ViewStyle>;
}> = ({ escrows, style }) => {
  // variables
  const ROWS = TABLE_ROWS;
  const selectedWallet = useSelectedWallet();
  // returns
  return (
    <>
      <TableRow headings={Object.values(ROWS)} />
      <FlatList
        data={escrows}
        style={style}
        renderItem={({ item }) => <EscrowRow escrow={item} />}
      />
    </>
  );
};

const getStringStatus = ["Create-Contract", "Accept", "Cancel", "Complete"];

const EscrowRow: React.FC<{
  escrow: EscrowInfo;
}> = ({ escrow }) => {
  const selectedWallet = useSelectedWallet();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: layout.contentPadding,
        paddingHorizontal: layout.padding_x2_5,
        borderColor: mineShaftColor,
        borderTopWidth: 1,
        paddingVertical: layout.padding_x2,
      }}
    >
      <BrandText
        style={[
          fontSemibold13,
          { flex: TABLE_ROWS.sender.flex, paddingRight: layout.padding_x1 },
        ]}
      >
        {escrow.sender}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: TABLE_ROWS.receiver.flex,
          paddingRight: layout.padding_x1,
        }}
      >
        <SpacerRow size={1} />
        <BrandText style={fontSemibold13}>{escrow.receiver}</BrandText>
      </View>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.amount.flex,
            paddingRight: layout.padding_x1,
          },
        ]}
      >
        {escrow.amount}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.expireAt.flex,
            paddingRight: layout.padding_x1,
          },
        ]}
      >
        {escrow.expireAt}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.status.flex,
            paddingRight: layout.padding_x1,
          },
        ]}
      >
        {getStringStatus[escrow.status]}
      </BrandText>
    </View>
  );
};
