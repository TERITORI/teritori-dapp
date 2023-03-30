import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";

export const CollectionInfoInline: React.FC<{
  imageSource: ImageSourcePropType;
  id?: string;
  name?: string;
}> = ({ imageSource, id, name }) => {
  return (
    <OmniLink
      to={{
        screen: "Collection",
        params: { id },
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={imageSource}
          style={{ height: 32, width: 32, borderRadius: 999 }}
        />
        <BrandText
          style={[fontSemibold14, { marginLeft: layout.padding_x1_5 }]}
        >
          {name}
        </BrandText>
      </View>
    </OmniLink>
  );
};
