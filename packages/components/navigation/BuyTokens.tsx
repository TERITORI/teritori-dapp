import React from "react";
import { Linking, TextStyle, TouchableOpacity } from "react-native";
import { CreditCardIcon } from "react-native-heroicons/outline";

import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const BuyTokens: React.FC<{
  flexDirection: "row" | "column";
  textStyle: TextStyle;
}> = ({ flexDirection, textStyle }) => {
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.padding_x1,
        flexDirection,
      }}
      onPress={() => {
        Linking.openURL("https://frontier.osmosis.zone/?from=OSMO&to=TORI");
      }}
    >
      <CreditCardIcon
        color={primaryColor}
        style={{ marginRight: flexDirection === "row" ? layout.padding_x1 : 0 }}
      />
      <BrandText style={textStyle}>Buy Tokens</BrandText>
    </TouchableOpacity>
  );
};
