import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";

import defaultNameNFT from "../../../assets/default-images/default-name-nft.png";
import { useToken } from "../../hooks/tokens";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NameAndTldText } from "./NameAndTldText";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
  style?: StyleProp<ViewStyle>;
  name: string;
}> = ({ style, name }) => {
  const { token } = useToken(name, process.env.TLD);
  const width = 332;
  const height = 404;
  const imageMargin = 12;

  return (
    <TertiaryBox height={height} width={width} style={style}>
      <Image
        source={
          token && token.image && token.image !== ""
            ? token.image
            : defaultNameNFT
        }
        style={{
          width: width - imageMargin * 2,
          height: width - imageMargin * 2,
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
    </TertiaryBox>
  );
};
