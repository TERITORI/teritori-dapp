import React from "react";
import { ImageURISource, View } from "react-native";

import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";

export const CollectionInfoInline: React.FC<{
  imageSource: ImageURISource;
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
        <OptimizedImage
          sourceURI={imageSource.uri}
          style={{ height: 32, width: 32, borderRadius: 999 }}
          height={32}
          width={32}
        />
        <BrandText
          style={[fontSemibold14, { marginLeft: layout.spacing_x1_5 }]}
        >
          {name}
        </BrandText>
      </View>
    </OmniLink>
  );
};
