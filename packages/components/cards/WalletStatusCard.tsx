import React from "react";
import { View } from "react-native";

import teritoriCircleSVG from "../../../assets/icons/teritori-circle.svg";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SuccessBadge } from "../badges/SuccessBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const WalletStatusCard: React.FC = () => {
  return (
    <TertiaryBox
      fullWidth
      mainContainerStyle={{
        backgroundColor: neutral17,
        paddingLeft: 8,
        paddingRight: 13,
        paddingTop: 7,
        paddingBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG width={24} height={24} source={teritoriCircleSVG} />
        <View style={{ marginLeft: 8 }}>
          <BrandText
            style={[fontSemibold12, { marginBottom: 2, color: neutral77 }]}
          >
            Teritori
          </BrandText>
          <BrandText style={fontSemibold13}>GxF34...3A31</BrandText>
        </View>
      </View>

      <SuccessBadge label="connected" />
    </TertiaryBox>
  );
};
