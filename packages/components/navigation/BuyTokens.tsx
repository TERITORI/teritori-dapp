import React from "react";
import { Linking, TouchableOpacity } from "react-native";
import { CreditCardIcon } from "react-native-heroicons/outline";

import { primaryColor } from "../../utils/style/colors";
import { fontBold16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const BuyTokens: React.FC = () => {
  return (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.padding_x1,
        flexDirection: "row",
      }}
      onPress={() => {
        Linking.openURL("https://frontier.osmosis.zone/?from=OSMO&to=TORI");
      }}
    >
      <CreditCardIcon
        color={primaryColor}
        style={{ marginRight: layout.padding_x1 }}
      />
      <BrandText style={fontBold16}>Buy Tokens</BrandText>
    </TouchableOpacity>
  );
};
