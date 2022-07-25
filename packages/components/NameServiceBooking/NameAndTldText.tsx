import React from "react";
import { View } from "react-native";

import { neutral77 } from "../../utils/colors";
import { tldFromToken, tokenWithoutTld } from "../../utils/handefulFunctions";
import { BrandText } from "../BrandText";

// A text with the substring ".xxx" grayed
export const NameAndTldText: React.FC<{
  nameAndTldStr: string;
}> = ({ nameAndTldStr }) => {
  console.log("nameAndTldStr", nameAndTldStr);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/*---- White part*/}
      <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
        {tokenWithoutTld(nameAndTldStr)}
      </BrandText>
      {/*---- Gray part*/}
      <BrandText style={{ color: neutral77, letterSpacing: -(20 * 0.04) }}>
        {tldFromToken(nameAndTldStr)}
      </BrandText>
    </View>
  );
};
