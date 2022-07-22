import React from "react";
import { View } from "react-native";

import { neutral77 } from "../../utils/colors";
import { BrandText } from "../BrandText";

// A text with the substring ".xxx" grayed
export const NameAndDomainText: React.FC<{
  nameAndDomainStr: string;
}> = ({ nameAndDomainStr }) => {
  const normalPartStr = nameAndDomainStr.substring(
    0,
    nameAndDomainStr.indexOf(".")
  );
  const grayedPartStr = nameAndDomainStr.substr(nameAndDomainStr.indexOf("."));

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
        {normalPartStr}
      </BrandText>
      <BrandText style={{ color: neutral77, letterSpacing: -(20 * 0.04) }}>
        {grayedPartStr}
      </BrandText>
    </View>
  );
};
