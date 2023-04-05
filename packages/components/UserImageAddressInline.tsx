import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "./BrandText";
import { fontSemibold12 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { tinyAddress } from "../utils/text";

export const UserImageAddressInline: React.FC<{
  imageSource: string;
  address: string;
  style?: StyleProp<ViewStyle>;
}> = ({ imageSource, address, style }) => {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <Image
        source={{ uri: imageSource }}
        style={{ height: 16, width: 16, borderRadius: 999 }}
      />
      <BrandText
        style={[fontSemibold12, { marginLeft: layout.padding_x1_5 / 2 }]}
      >
        {tinyAddress(address, 16)}
      </BrandText>
    </View>
  );
};
