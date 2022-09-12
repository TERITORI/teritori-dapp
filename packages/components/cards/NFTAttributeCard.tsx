import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../utils/style/fonts";
import { NFTAttribute } from "../../utils/types/nft";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";

// TODO: Dynamic data + props

export const NFTAttributeCard: React.FC<{
  nftAttribute?: NFTAttribute;
  style?: StyleProp<ViewStyle>;
}> = ({ nftAttribute, style }) => {
  return (
    <TertiaryBox
      height={66}
      width={192}
      style={style}
      mainContainerStyle={{ padding: 12, alignItems: "flex-start" }}
    >
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {nftAttribute.traitType}
      </BrandText>
      <BrandText style={[fontMedium14, { marginTop: 6 }]}>
        {nftAttribute.value}
      </BrandText>
    </TertiaryBox>
  );
};
