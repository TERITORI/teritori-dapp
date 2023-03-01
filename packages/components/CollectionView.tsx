import React, { useMemo } from "react";
import { Image, StyleSheet, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Collection, MintState } from "../api/marketplace/v1/marketplace";
import { useCollectionInfo } from "../hooks/useCollectionInfo";
import { useNavigateToCollection } from "../hooks/useNavigateToCollection";
import { fontBold11, fontMedium10, fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { GradientText } from "./gradientText";

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
}> = ({ item, size = "XL", linkToMint, mintState }) => {
  const navigateToCollection = useNavigateToCollection(item.id, {
    forceSecondaryDuringMint: item.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });
  const sizedStyles = useMemo(() => StyleSheet.flatten(styles[size]), [size]);

  const navigateToTwitter = () => {
    Linking.openURL(item.twitterUrl);
  };
  const { info } = useCollectionInfo(item.id);
  const percentageMinted = info
    ? Math.round(
        (parseInt(info.mintedAmount as string, 10) * 100) /
          parseInt(info.maxSupply as string, 10)
      )
    : NaN;
  return (
    <TouchableOpacity
      onPress={item.id ? navigateToCollection : navigateToTwitter}
    >
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
                {!isNaN(percentageMinted) ? `${percentageMinted}%` : ""}
              </BrandText>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "nowrap",
              marginTop: layout.padding_x1,
            }}
          >
            {mintState !== MintState.MINT_STATE_UNSPECIFIED &&
            info?.maxSupply ? (
              <>
                <GradientText
                  style={sizedStyles.creatorName}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  gradientType="purple"
                >
                  {info.maxSupply !== "" ? `Supply ${info?.maxSupply}` : ""}
                </GradientText>
                <GradientText
                  style={sizedStyles.creatorName}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  gradientType="purple"
                >
                  {info?.prettyUnitPrice}
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
      width: COLLECTION_VIEW_XL_WIDTH - 24,
      height: COLLECTION_VIEW_XL_WIDTH - 24,
      borderRadius: 12,
    },
    textsContainer: {
      marginHorizontal: layout.padding_x1_5,
      marginTop: layout.padding_x2,
    },
    collectionName: {
      ...(fontSemibold14 as object),
    },
    percentage: {
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
    percentage: {
      ...(fontBold11 as object),
    },
    creatorName: {
      ...(fontMedium10 as object),
    },
  },
};
