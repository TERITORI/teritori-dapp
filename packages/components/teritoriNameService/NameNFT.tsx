import React from "react";
import { Image, StyleProp, ViewStyle, View } from "react-native";

import { NameAndTldText } from "./NameAndTldText";
import defaultNameNFT from "../../../assets/default-images/default-name-nft.png";
import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold16 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
  style?: StyleProp<ViewStyle>;
  name: string;
  width?: number;
}> = ({ style, name, width = 332 }) => {
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const tokenId = name + network?.nameServiceTLD || "";

  const { nsInfo: token } = useNSNameInfo(networkId, tokenId);

  const imageMargin = 12;

  return (
    <View style={[{ alignItems: "center" }, style]}>
      <Image
        source={
          typeof token?.extension.image === "string"
            ? ipfsURLToHTTPURL(token.extension.image)
            : defaultNameNFT
        }
        style={{
          width: width - imageMargin * 2,
          height: width - imageMargin * 2,
          minHeight: width - imageMargin * 2,
          margin: imageMargin,
        }}
      />

      <NameAndTldText
        nameAndTldStr={tokenId}
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
