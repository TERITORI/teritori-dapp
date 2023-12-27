import React, { useMemo } from "react";
import { StyleSheet, Linking, View, Pressable } from "react-native";

import { BrandText } from "./BrandText";
import { OptimizedImage } from "./OptimizedImage";
import { Box } from "./boxes/Box";
import { GradientText } from "./gradientText";
import { Collection, MintState } from "../api/marketplace/v1/marketplace";
import { useCollectionThumbnailInfo } from "../hooks/collection/useCollectionThumbnailInfo";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { neutral44 } from "../utils/style/colors";
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
  onPress?: () => void;
}> = ({ item, size = "XL", linkToMint, mintState, onPress }) => {
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  const sizedStyles = useMemo(() => StyleSheet.flatten(styles[size]), [size]);

  const navigateToTwitter = () => {
    Linking.openURL(item.twitterUrl);
  };

  const info = useCollectionThumbnailInfo(item.id);

  return (
    <Pressable
      onPress={() => {
        onPress && onPress();
        if (item.id !== "") navigateToCollection();
        else navigateToTwitter();
      }}
      disabled={item.id === "" && item.twitterUrl === ""}
    >
      <Box
        notched={size !== "XS"}
        style={[
          {
            width: sizedStyles.box.width,
            height: sizedStyles.box.height,
            borderWidth: 1,
            borderColor: neutral44,
          },
          sizedStyles.boxMainContainer,
        ]}
      >
        <OptimizedImage
          sourceURI={item.imageUri}
          width={sizedStyles.image.width}
          height={sizedStyles.image.height}
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
      </Box>
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
      paddingTop: layout.spacing_x1_5,
      paddingBottom: layout.spacing_x2_5,
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
      paddingTop: layout.spacing_x1,
      paddingBottom: layout.spacing_x1,
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
