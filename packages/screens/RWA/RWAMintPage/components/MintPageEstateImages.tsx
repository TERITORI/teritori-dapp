import React from "react";
import { TouchableOpacity, FlatList, View } from "react-native";

import RealEstatePlaceholder from "../../../../../assets/default-images/real-estate-placeholder.png";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { useTheme } from "../../../../hooks/useTheme";

const MainImage: React.FC<{ sourceURI: string }> = ({ sourceURI }) => {
  const imageSize = 534;
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12.35,

        elevation: 19,
      }}
    >
      <OptimizedImage
        width={imageSize}
        height={imageSize}
        sourceURI={sourceURI}
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
};

export const MintPageEstateImages: React.FC = () => {
  const [images] = React.useState<string[]>([
    RealEstatePlaceholder,
    RealEstatePlaceholder,
    RealEstatePlaceholder,
    RealEstatePlaceholder,
    RealEstatePlaceholder,
    RealEstatePlaceholder,
  ]);
  const [mainImage, setMainImage] = React.useState<string>(images[0]);
  const theme = useTheme();

  const imageSize = 96;

  return (
    <View>
      <MainImage sourceURI={mainImage} />
      <View style={{ marginTop: 20 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setMainImage(item)}
              >
                <TertiaryBox
                  mainContainerStyle={{
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.backgroundColor,
                  }}
                  squaresBackgroundColor={theme.backgroundColor}
                >
                  <OptimizedImage
                    sourceURI={item}
                    width={imageSize}
                    height={imageSize}
                    style={{ width: imageSize, height: imageSize }}
                  />
                </TertiaryBox>
              </TouchableOpacity>
            );
          }}
          data={images}
        />
      </View>
    </View>
  );
};
