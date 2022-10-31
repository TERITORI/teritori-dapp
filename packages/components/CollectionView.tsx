import React from "react";
import { Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Collection } from "../api/marketplace/v1/marketplace";
import { useTNSMetadata } from "../hooks/useTNSMetadata";
import { useAppNavigation } from "../utils/navigation";
import { lavenderDefault } from "../utils/style/colors";
import { BrandText } from "./BrandText";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const collectionItemHeight = 266;
export const collectionItemWidth = 196;
const contentWidth = 172;

export const CollectionView: React.FC<{
  item: Collection;
}> = ({ item }) => {
  const creatorAddress = item.creatorId.replace("tori-", "");
  const tnsMetadata = useTNSMetadata(creatorAddress);
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Collection", { id: item.id })}
      disabled={!item.id}
    >
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
            <BrandText
              style={{ color: lavenderDefault, fontSize: 14 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {tnsMetadata.metadata?.tokenId ||
                item.creatorName ||
                creatorAddress}
            </BrandText>
          </View>
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
