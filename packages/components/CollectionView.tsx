import React from "react";
import { Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import certifiedIconSVG from "../../assets/icons/certified.svg";
import { Collection } from "../api/marketplace/v1/marketplace";
import { useAppNavigation } from "../utils/navigation";
import { lavenderDefault } from "../utils/style/colors";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const collectionItemHeight = 266;
export const collectionItemWidth = 196;
const contentWidth = 172;

export const CollectionView: React.FC<{
  item: Collection;
}> = ({ item }) => {
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
              {item.creatorName}
            </BrandText>
            {item.verified && (
              <View style={{ marginLeft: 14 }}>
                <SVG source={certifiedIconSVG} width={16} height={16} />
              </View>
            )}
          </View>
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
