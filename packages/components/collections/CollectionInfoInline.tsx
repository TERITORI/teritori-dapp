import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const CollectionInfoInline: React.FC<{
  imageSource: ImageSourcePropType;
  name: string;
}> = ({ imageSource, name }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={imageSource}
        style={{ height: 32, width: 32, borderRadius: 999 }}
      />
      <BrandText style={[fontSemibold14, { marginLeft: 12 }]}>{name}</BrandText>
    </View>
  );
};
