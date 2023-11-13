import React from "react";
import { View } from "react-native";
import { enableLegacyWebImplementation } from "react-native-gesture-handler";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import RealEstatePlaceholder from "../../../../../../assets/default-images/real-estate-placeholder.png";
import { OptimizedImage } from "../../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../../components/boxes/TertiaryBox";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { neutral44 } from "../../../../../utils/style/colors";

const data: string[] = [
  RealEstatePlaceholder,
  RealEstatePlaceholder,
  RealEstatePlaceholder,
];

export const RWACarousel: React.FC = () => {
  const [index, handleIndex] = React.useState<number>(0);
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const imageSize = 464;
  const carouselRef = React.useRef<ICarouselInstance | null>(null);
  const selectedBackgroundColor = isLightTheme ? "#000" : "#FFF";
  const unselectedBackgroundColor = isLightTheme ? "#C5C5C5" : neutral44;
  enableLegacyWebImplementation(true);

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <TertiaryBox
        mainContainerStyle={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.5,
          shadowRadius: 12.35,

          elevation: 19,
        }}
        noBrokenCorners
        height={imageSize}
        width={imageSize}
      >
        <Carousel
          ref={carouselRef}
          width={imageSize}
          height={imageSize}
          data={data}
          panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
          onProgressChange={(_, absoluteProgress) => {
            handleIndex(Math.round(absoluteProgress));
          }}
          autoPlay
          pagingEnabled
          autoPlayInterval={7000}
          renderItem={({ item, index }) => (
            <OptimizedImage
              width={imageSize}
              height={imageSize}
              sourceURI={item}
              key={`Carousel-${index}`}
              style={{ width: imageSize, height: imageSize }}
            />
          )}
        />
      </TertiaryBox>
      <View style={{ width: imageSize }}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "space-evenly",
            padding: 7,
            top: -30,
            backgroundColor: theme.headerBackgroundColor,
            borderRadius: 10,
          }}
        >
          {data.map((_, indexData) => {
            return (
              <View
                key={`Index-${indexData}`}
                style={{
                  backgroundColor:
                    index === indexData
                      ? selectedBackgroundColor
                      : unselectedBackgroundColor,
                  borderRadius: 4,
                  width: index === indexData ? 16 : 8,
                  height: 4,
                  marginHorizontal: 2,
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};
