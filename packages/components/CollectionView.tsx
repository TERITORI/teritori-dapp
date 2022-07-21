import React from "react";
import { Image, View } from "react-native";

import { Collection } from "../api/marketplace/v1/marketplace";
import { BrandText } from "./BrandText";
import { CardOutline } from "./CardOutline";
import { CertifiedIcon } from "./svgs/CertifiedIcon";

export const collectionItemHeight = 266;
export const collectionItemWidth = 196;

export const CollectionView: React.FC<{
  item: Collection;
}> = ({ item }) => {
  return (
    <CardOutline
      style={{
        paddingTop: 12,
        paddingBottom: 20,
        width: collectionItemWidth,
        height: collectionItemHeight,
      }}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={{
          width: 172,
          height: 172,
          alignSelf: "center",
          borderRadius: 12,
        }}
      />
      <View style={{ marginHorizontal: 12, marginTop: 16 }}>
        <BrandText
          style={{ fontSize: 14 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.collectionName}
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <BrandText
            style={{ color: "#AEB1FF", fontSize: 14 }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {item.creatorName}
          </BrandText>
          {item.verified && (
            <View style={{ marginLeft: 14 }}>
              <CertifiedIcon />
            </View>
          )}
        </View>
      </View>
    </CardOutline>
  );
};
