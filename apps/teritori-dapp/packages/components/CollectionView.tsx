import React, { useMemo } from "react";
import { StyleSheet, Linking, View, Pressable } from "react-native";

import { BrandText } from "./BrandText";
import { OptimizedImage } from "./OptimizedImage";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { GradientText } from "./gradientText";
import { Collection, MintState } from "../api/marketplace/v1/marketplace";
import { useCollectionThumbnailInfo } from "../hooks/collection/useCollectionThumbnailInfo";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { fontBold11, fontMedium10, fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

type CollectionViewSize = "XL" | "XS";
export const COLLECTION_VIEW_SM_WIDTH = 124;
export const COLLECTION_VIEW_SM_HEIGHT = 164;
export const COLLECTION_VIEW_XL_WIDTH = 256;
export const COLLECTION_VIEW_XL_HEIGHT = 315;

export const CollectionView: React.FC<{
  item: Collection;
  size?: CollectionViewSize;
  linkToMint?: boolean;
  mintState: number;
  width?: number;
  onPress?: () => void;
}> = ({ item, size = "XL", linkToMint, mintState, onPress, width }) => {
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  const sizedStyles = useMemo(() => StyleSheet.flatten(styles[size]), [size]);
  width = typeof width === "number" ? width : sizedStyles.box.width;

  const navigateToTwitter = () => {
    Linking.openURL(item.twitterUrl);
  };

  const info = useCollectionThumbnailInfo(item.id);

  const imgSize = width - sizedStyles.boxMainContainer.paddingVertical * 2;

  return (
    <Pressable
      onPress={() => {
        onPress && onPress();
        if (item.id !== "") navigateToCollection();
        else navigateToTwitter();
      }}
      disabled={item.id === "" && item.twitterUrl === ""}
    >
      <TertiaryBox style={[sizedStyles.boxMainContainer, { width }]}>
        <OptimizedImage
          sourceURI={item.imageUri}
          width={250}
          height={250}
          style={{
            width: imgSize,
            height: imgSize,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "nowrap",
            }}
          >
            <BrandText
              style={{
                ...sizedStyles.collectionName,
                width: "100%",
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.collectionName}
            </BrandText>
            {info && mintState !== MintState.MINT_STATE_UNSPECIFIED ? (
              <BrandText
                style={{
                  ...sizedStyles.percentage,
                }}
              >
                {!isNaN(info.percentageMinted)
                  ? `${info.percentageMinted}%`
                  : ""}
              </BrandText>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "nowrap",
              marginTop: layout.spacing_x1,
            }}
          >
            {info &&
            mintState !== MintState.MINT_STATE_UNSPECIFIED &&
            info.maxSupply !== 0 ? (
              <>
                <GradientText
                  style={sizedStyles.creatorName}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  gradientType="purple"
                >
                  {info.maxSupply ? `Supply ${info.maxSupply}` : ""}
                </GradientText>
                <GradientText
                  style={sizedStyles.creatorName}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  gradientType="purple"
                >
                  {info.prettyUnitPrice}
                </GradientText>
              </>
            ) : (
              <GradientText
                style={sizedStyles.creatorName}
                ellipsizeMode="tail"
                numberOfLines={1}
                gradientType="purple"
              >
                {item.creatorName}
              </GradientText>
            )}
          </View>
        </View>
      </TertiaryBox>
    </Pressable>
  );
};

const styles = {
  XL: {
    box: {
      width: COLLECTION_VIEW_XL_WIDTH,
      height: COLLECTION_VIEW_XL_HEIGHT,
    },
    boxMainContainer: {
      paddingVertical: layout.spacing_x2,
    },
    image: {
      width: COLLECTION_VIEW_XL_WIDTH - 24,
      height: COLLECTION_VIEW_XL_WIDTH - 24,
      borderRadius: 12,
    },
    textsContainer: {
      marginHorizontal: layout.spacing_x1_5,
      marginTop: layout.spacing_x2,
    },
    collectionName: {
      ...fontSemibold14,
    },
    percentage: {
      ...fontSemibold14,
    },
    creatorName: {
      ...fontSemibold14,
    },
  },

  XS: {
    box: {
      width: COLLECTION_VIEW_SM_WIDTH,
      height: COLLECTION_VIEW_SM_HEIGHT,
    },
    boxMainContainer: {
      paddingVertical: layout.spacing_x2,
    },
    image: {
      width: 108,
      height: 108,
      borderRadius: 4,
    },
    textsContainer: {
      marginHorizontal: layout.spacing_x1,
      marginTop: layout.spacing_x1,
    },
    collectionName: {
      ...fontBold11,
    },
    percentage: {
      ...fontBold11,
    },
    creatorName: {
      ...fontMedium10,
    },
  },
};
