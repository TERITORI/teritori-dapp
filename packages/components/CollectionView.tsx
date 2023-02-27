import React from "react";
import { Image, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Collection } from "../api/marketplace/v1/marketplace";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { parseUserId } from "../networks";
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
  const [, creatorAddress] = parseUserId(item.creatorId);
  const userInfo = useNSUserInfo(item.creatorId);
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  const navigateToTwitter = () => {
    Linking.openURL(item.twitterUrl);
  };
  return (
    <TouchableOpacity
      onPress={item.id ? navigateToCollection : navigateToTwitter}
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
            <GradientText
              style={fontSemibold14}
              ellipsizeMode="tail"
              numberOfLines={1}
              gradientType="purple"
            >
              {userInfo.metadata?.tokenId || item.creatorName || creatorAddress}
            </GradientText>
          </View>
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
};
