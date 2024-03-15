import React from "react";
import { Image, Platform, StyleProp, View, ViewStyle } from "react-native";

import { NameAndTldText } from "./NameAndTldText";
import defaultNameNFT from "../../../assets/default-images/default-name-nft.png";
import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork } from "../../networks";
import { web3ToWeb2URI } from "../../utils/ipfs";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold16 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { OptimizedImage } from "../OptimizedImage";
import { SpacerColumn } from "../spacer";

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
      {Platform.OS === "web" ? (
        <Image
          source={
            typeof token?.extension.image === "string"
              ? web3ToWeb2URI(token.extension.image)
              : defaultNameNFT
          }
          style={{
            width: width - imageMargin * 2,
            height: width - imageMargin * 2,
            minHeight: width - imageMargin * 2,
            margin: imageMargin,
          }}
        />
      ) : (
        <OptimizedImage
          width={width - imageMargin * 2}
          height={width - imageMargin * 2}
          sourceURI={web3ToWeb2URI(token?.extension?.image || "")}
          style={[
            {
              width: width - imageMargin * 2,
              height: width - imageMargin * 2,
              backgroundColor: "black",
            },
          ]}
        />
      )}

      {Platform.OS === "web" ? (
        <NameAndTldText
          nameAndTldStr={tokenId}
          style={{
            justifyContent: "center",
            marginHorizontal: imageMargin,
            width: width - imageMargin * 2,
          }}
        />
      ) : (
        <>
          <SpacerColumn size={1.5} />
          <BrandText>{tokenId}</BrandText>
        </>
      )}
      <BrandText style={[fontSemibold16, { color: neutral77 }]}>
        {name}
      </BrandText>
    </View>
  );
};
