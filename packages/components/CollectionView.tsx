import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { BrandText } from "./BrandText";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { GradientText } from "./gradientText";
import { Collection } from "../api/marketplace/v1/marketplace";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { parseUserId } from "../networks";
import { fontBold11, fontMedium10, fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

type CollectionViewSize = "XL" | "XS";
export const COLLECTION_VIEW_SM_WIDTH = 124;
export const COLLECTION_VIEW_SM_HEIGHT = 164;
export const COLLECTION_VIEW_XL_WIDTH = 196;
export const COLLECTION_VIEW_XL_HEIGHT = 266;

export const CollectionView: React.FC<{
  item: Collection;
  size?: CollectionViewSize;
  linkToMint?: boolean;
}> = ({ item, size = "XL", linkToMint }) => {
  const [, creatorAddress] = parseUserId(item.creatorId);
  const userInfo = useNSUserInfo(item.creatorId);
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  const sizedStyles = useMemo(() => StyleSheet.flatten(styles[size]), [size]);

  return (
    <TouchableOpacity onPress={navigateToCollection} disabled={!item.id}>
      <TertiaryBox
        noBrokenCorners={size === "XS"}
        mainContainerStyle={sizedStyles.boxMainContainer}
        width={sizedStyles.box.width}
        height={sizedStyles.box.height}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={{
            width: sizedStyles.image.width,
            height: sizedStyles.image.height,
            alignSelf: "center",
            borderRadius: sizedStyles.image.borderRadius,
          }}
        />
        <View
          style={{
            marginHorizontal: sizedStyles.textsContainer.marginHorizontal,
            marginTop: sizedStyles.textsContainer.marginTop,
            width: sizedStyles.image.width,
          }}
        >
          <BrandText
            style={sizedStyles.collectionName}
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
              style={sizedStyles.creatorName}
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

const styles = {
  XL: {
    box: {
      width: COLLECTION_VIEW_XL_WIDTH,
      height: COLLECTION_VIEW_XL_HEIGHT,
    },
    boxMainContainer: {
      paddingTop: layout.padding_x1_5,
      paddingBottom: layout.padding_x2_5,
    },
    image: {
      width: 172,
      height: 172,
      borderRadius: 12,
    },
    textsContainer: {
      marginHorizontal: layout.padding_x1_5,
      marginTop: layout.padding_x2,
    },
    collectionName: {
      ...(fontSemibold14 as object),
    },
    creatorName: {
      ...(fontSemibold14 as object),
    },
  },

  XS: {
    box: {
      width: COLLECTION_VIEW_SM_WIDTH,
      height: COLLECTION_VIEW_SM_HEIGHT,
    },
    boxMainContainer: {
      paddingTop: layout.padding_x1,
      paddingBottom: layout.padding_x1,
    },
    image: {
      width: 108,
      height: 108,
      borderRadius: 4,
    },
    textsContainer: {
      marginHorizontal: layout.padding_x1,
      marginTop: layout.padding_x1,
    },
    collectionName: {
      ...(fontBold11 as object),
    },
    creatorName: {
      ...(fontMedium10 as object),
    },
  },
};
