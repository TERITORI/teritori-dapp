import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

import { Avatar } from "../../../components/Avatar";
import { BrandText } from "../../../components/BrandText";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { SpacerRow } from "../../../components/spacer";
import { TableRow, TableRowHeading } from "../../../components/table";
import { useKeybaseAvatarURL } from "../../../hooks/useKeybaseAvatarURL";
import { removeObjectKey } from "../../../utils/common";
import { mineShaftColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ValidatorInfo } from "../types";

const TABLE_ROWS: { [key in string]: TableRowHeading } = {
  rank: {
    label: "Rank",
    flex: 1,
  },
  name: {
    label: "Name",
    flex: 4,
  },
  votingPower: {
    label: "Voting Power",
    flex: 3,
  },
  commission: {
    label: "Commission",
    flex: 4,
  },
  actions: {
    label: "",
    flex: 2,
  },
};

interface ValidatorsListAction {
  label: string;
  onPress?: (validator: ValidatorInfo) => void;
}

export const ValidatorsTable: React.FC<{
  validators: ValidatorInfo[];
  actions?: (validator: ValidatorInfo) => ValidatorsListAction[];
  style?: StyleProp<ViewStyle>;
}> = ({ validators, actions, style }) => {
  // variables
  const ROWS = actions ? TABLE_ROWS : removeObjectKey(TABLE_ROWS, "actions");

  // returns
  return (
    <>
      <TableRow headings={Object.values(ROWS)} />
      <FlatList
        data={validators}
        style={style}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <ValidatorRow validator={item} actions={actions} />
        )}
      />
    </>
  );
};

const ValidatorRow: React.FC<{
  validator: ValidatorInfo;
  actions?: (validator: ValidatorInfo) => ValidatorsListAction[];
}> = ({ validator, actions }) => {
  const imageURL = useKeybaseAvatarURL(validator.identity);
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
          { flex: TABLE_ROWS.rank.flex, paddingRight: layout.padding_x1 },
        ]}
      >
        {validator.rank}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: TABLE_ROWS.name.flex,
          paddingRight: layout.padding_x1,
        }}
      >
        <Avatar uri={imageURL || ""} />
        <SpacerRow size={1} />
        <BrandText style={fontSemibold13}>{validator?.moniker || ""}</BrandText>
      </View>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.votingPower.flex,
            paddingRight: layout.padding_x1,
          },
        ]}
      >
        {validator.votingPower}
      </BrandText>
      <BrandText
        style={[
          fontSemibold13,
          {
            flex: TABLE_ROWS.commission.flex,
            paddingRight: actions ? layout.padding_x1 : 0,
          },
        ]}
      >
        {validator.commission}
      </BrandText>
      {actions && (
        <View
          style={{
            flex: TABLE_ROWS.actions.flex,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {actions(validator).map((action, index) => (
            <SecondaryButtonOutline
              key={index}
              onPress={() => {
                if (typeof action.onPress !== "function") {
                  return;
                }
                action.onPress(validator);
              }}
              text={action.label}
              size="XS"
            />
          ))}
        </View>
      )}
    </View>
  );
};
