import React from "react";
import { ViewStyle, Image, View, StyleProp } from "react-native";

import outlineStarPNG from "../../assets/icons/outline-star.png";
import { neutral33, neutral77 } from "../utils/colors";
import { NFTData } from "../utils/types/nft";
import { BrandText } from "./BrandText";
import { CardOutline } from "./cards/CardOutline";
import { NetworkIcon } from "./NetworkIcon";
import { SecondaryAltButton } from "./buttons/SecondaryAltButton";
import { CertifiedIcon } from "./svgs/CertifiedIcon";

export const NFTView: React.FC<{
  data: NFTData;
  style?: StyleProp<ViewStyle>;
}> = ({ data, style }) => {
  const collectionFontSize = 12;
  const favoriteCountFontSize = 12;
  const floorPriceLabelFontSize = 12;
  return (
    <CardOutline
      style={[
        {
          paddingVertical: 16,
          width: 268,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: data.imageURI }}
        style={{
          width: 236,
          height: 236,
          alignSelf: "center",
          borderRadius: 12,
        }}
      />

      <View style={{ marginHorizontal: 16 }}>
        <BrandText
          style={{ marginTop: 16, fontSize: 14 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {data.name}
        </BrandText>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
            }}
          >
            <NetworkIcon network={data.network} circle size={24} />
            <BrandText
              style={{
                fontSize: collectionFontSize,
                letterSpacing: -(collectionFontSize * 0.04),
                marginHorizontal: 4,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {data.collectionName}
            </BrandText>
            {data.isCertified && <CertifiedIcon />}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 16,
            }}
          >
            <BrandText
              style={{
                fontSize: favoriteCountFontSize,
                letterSpacing: -(favoriteCountFontSize * 0.04),
                color: neutral77,
              }}
            >
              {data.favoritesCount}
            </BrandText>
            <Image
              source={outlineStarPNG}
              style={{ width: 24, height: 24, resizeMode: "stretch" }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
          marginBottom: 14,
          marginTop: 12,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <NetworkIcon network={data.network} circle size={24} />
          <BrandText
            style={{
              marginLeft: 6,
              fontSize: floorPriceLabelFontSize,
              letterSpacing: -(floorPriceLabelFontSize * 0.04),
              color: neutral77,
            }}
          >
            Floor Price
          </BrandText>
        </View>
        <SecondaryAltButton text={data.floorPrice} />
      </View>
    </CardOutline>
  );
};
