import React from "react";
import { Image, View, ViewStyle } from "react-native";

import defaultNameNFT from "../../../assets/default-images/default-name-nft.png";
import { useToken } from "../../hooks/tokens";
import { neutral33 } from "../../utils/style/colors";
import { NameAndTldText } from "./NameAndTldText";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
  style?: ViewStyle;
  name: string;
}> = ({ style, name }) => {
  const { token } = useToken(name, process.env.TLD);
  const width = 332;
  const height = 404;
  const imageMargin = 12;

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#000000",
          height,
          minHeight: height,
          maxHeight: height,
          width: "100%",
          maxWidth: width,
        },
        style,
      ]}
    >
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
    </View>
  );
};
