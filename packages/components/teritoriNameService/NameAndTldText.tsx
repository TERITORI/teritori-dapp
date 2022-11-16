import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { gradientGray } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { tldFromToken, tokenWithoutTld } from "../../utils/tns";
import { BrandText } from "../BrandText";
import { GradientText } from "../gradientText";

// A text with the substring ".xxx" grayed
export const NameAndTldText: React.FC<{
  nameAndTldStr: string | null | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ nameAndTldStr, style }) => {
  if (!nameAndTldStr) {
    return null;
  }
  return (
    <View
      style={[
        { flex: 1, flexDirection: "row", width: "100%", alignItems: "center" },
        style,
      ]}
    >
      {/*---- White part*/}
      <BrandText
        style={{
          letterSpacing: -(20 * 0.04),
          maxWidth: "100%",
        }}
      >
        {tokenWithoutTld(nameAndTldStr)}
        {/*---- Gray part*/}
        <GradientText gradient={gradientGray} style={fontSemibold20}>
          {tldFromToken(nameAndTldStr)}
        </GradientText>
      </BrandText>
    </View>
  );
};
