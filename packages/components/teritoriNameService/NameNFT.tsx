import React from "react";
import { Image, StyleProp, ViewStyle, View } from "react-native";

import defaultNameNFT from "../../../assets/default-images/default-name-nft.png";
import { useToken } from "../../hooks/tokens";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold16 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { NameAndTldText } from "./NameAndTldText";
// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
  style?: StyleProp<ViewStyle>;
  name: string;
  width?: number;
}> = ({ style, name, width = 332 }) => {
  const { token } = useToken(name, process.env.TLD || "");

  const imageMargin = 12;

  return (
    <View style={[{ alignItems: "center" }, style]}>
      <Image
        source={
          token && token.image && token.image !== ""
            ? ipfsURLToHTTPURL(token.image)
            : defaultNameNFT
        }
        style={{
          width: "100%",
          height: width - imageMargin * 3,
          minHeight: width - imageMargin * 3,
          margin: imageMargin,
        }}
      />

      <NameAndTldText
        nameAndTldStr={name + process.env.TLD}
        style={{
          justifyContent: "center",
          marginHorizontal: imageMargin,
          width: width - imageMargin * 2,
        }}
      />
      <BrandText style={[fontSemibold16, { color: neutral77 }]}>
        {name}
      </BrandText>
    </View>
  );
};
