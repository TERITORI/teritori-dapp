import React from "react";
import { Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Collection } from "../api/marketplace/v1/marketplace";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { useTNSMetadata } from "../hooks/useTNSMetadata";
import { fontSemibold14 } from "../utils/style/fonts";
import { BrandText } from "./BrandText";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { GradientText } from "./gradientText";

export const collectionItemHeight = 266;
export const collectionItemWidth = 196;
const contentWidth = 172;

export const CollectionView: React.FC<{
  item: Collection;
  linkToMint?: boolean;
}> = ({ item, linkToMint }) => {
  const creatorAddress = item.creatorId
    .replace("tori-", "")
    .replace("eth-", "");
  const tnsMetadata = useTNSMetadata(creatorAddress);
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  return (
    <TouchableOpacity onPress={navigateToCollection} disabled={!item.id}>
      <TertiaryBox
        mainContainerStyle={{
          paddingTop: 12,
          paddingBottom: 20,
        }}
        width={collectionItemWidth}
        height={collectionItemHeight}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={{
            width: contentWidth,
            height: 172,
            alignSelf: "center",
            borderRadius: 12,
          }}
        />
        <View
          style={{ marginHorizontal: 12, marginTop: 16, width: contentWidth }}
        >
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
            <GradientText
              style={fontSemibold14}
              ellipsizeMode="tail"
              numberOfLines={1}
              gradientType="purple"
            >
              {tnsMetadata.metadata?.tokenId ||
                item.creatorName ||
                creatorAddress}
            </GradientText>
          </View>
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
