import React from "react";
import { View, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { tldFromToken, tokenWithoutTld } from "../../utils/tns";
import { BrandText } from "../BrandText";

// A text with the substring ".xxx" grayed
export const NameAndTldText: React.FC<{
  nameAndTldStr: string;
  style?: ViewStyle;
}> = ({ nameAndTldStr, style }) => {
  return (
    <View style={[{ flex: 1, flexDirection: "row", width: "100%" }, style]}>
      {/*---- White part*/}
      <BrandText
        style={{
          letterSpacing: -(20 * 0.04),
          maxWidth: "calc(100% - 12px * 2)",
        }}
      >
        {tokenWithoutTld(nameAndTldStr)}
        {/*---- Gray part*/}
        <BrandText style={{ color: neutral77, letterSpacing: -(20 * 0.04) }}>
          {tldFromToken(nameAndTldStr)}
        </BrandText>
      </BrandText>
    </View>
  );
};
