import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { fontSemibold20 } from "../../utils/style/fonts";
import { tldFromNSToken, nsTokenWithoutTLD } from "../../utils/tns";
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
        {nsTokenWithoutTLD(nameAndTldStr)}
        {/*---- Gray part*/}
        <GradientText gradientType="gray" style={fontSemibold20}>
          {tldFromNSToken(nameAndTldStr)}
        </GradientText>
      </BrandText>
    </View>
  );
};
