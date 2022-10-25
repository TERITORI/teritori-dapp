import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";

import { Avatar } from "../../../components/Avatar";
import { BrandText } from "../../../components/BrandText";
import { SecondaryButtonOutline } from "../../../components/buttons/SecondaryButtonOutline";
import { SpacerRow } from "../../../components/spacer";
import { TableRow, TableRowHeading } from "../../../components/table";
import { useKeybaseAvatarURL } from "../../../hooks/useKeybaseAvatarURL";
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
  actions: (validator: ValidatorInfo) => ValidatorsListAction[];
  style?: StyleProp<ViewStyle>;
}> = ({ validators, actions, style }) => {
  return (
    <>
      <TableRow headings={Object.values(TABLE_ROWS)} />
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
  actions: (validator: ValidatorInfo) => ValidatorsListAction[];
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
      <BrandText style={[fontSemibold13, { flex: 1, paddingRight: 8 }]}>
        {validator.rank}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 4,
          paddingRight: 8,
        }}
      >
        <Avatar uri={imageURL || ""} />
        <SpacerRow size={1} />
        <BrandText style={fontSemibold13}>{validator?.moniker || ""}</BrandText>
      </View>
      <BrandText style={[fontSemibold13, { flex: 3, paddingRight: 8 }]}>
        {validator.votingPower}
      </BrandText>
      <BrandText style={[fontSemibold13, { flex: 4, paddingRight: 8 }]}>
        {validator.commission}
      </BrandText>
      <View
        style={{
          flex: 2,
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
    </View>
  );
};
