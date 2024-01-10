import React from "react";
import { View } from "react-native";

import { SelectToken } from "./components/SelectToken";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../Settings/components/SettingBase";

export const SelectTokenScreen: ScreenFC<"MiniSelectToken"> = ({
  navigation,
}) => {
  const onSelectionOfToken = () => {
    navigation.replace("MiniDepositTORI");
  };

  return (
    <SettingBase title="Select Token" background="transparent">
      <View
        style={{
          paddingHorizontal: layout.spacing_x1_5,
          marginBottom: layout.spacing_x2,
        }}
      >
        <SelectToken
          onPress={() => onSelectionOfToken()}
          icon={teritoriSVG}
          title="Teritori"
          tori={62424}
        />
      </View>
    </SettingBase>
  );
};
