import React, { useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import RealEstatePlaceholder from "../../../../../../assets/default-images/real-estate-placeholder.png";
import { OptimizedImage } from "../../../../../components/OptimizedImage";
import { SecondaryBox } from "../../../../../components/boxes/SecondaryBox";
import { useIsMobile } from "../../../../../hooks/useIsMobile";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { neutral44 } from "../../../../../utils/style/colors";
import { layout } from "../../../../../utils/style/layout";

const data: string[] = [
  RealEstatePlaceholder,
  RealEstatePlaceholder,
  RealEstatePlaceholder,
];

export const RWACarousel: React.FC = () => {
  const [index, handleIndex] = useState<number>(0);
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();
  const isMobile = useIsMobile();
  const imageSize = isMobile ? 300 : 464;
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const selectedBackgroundColor = isLightTheme ? "#000" : "#FFF";
  const unselectedBackgroundColor = isLightTheme ? "#C5C5C5" : neutral44;

  return (
    <View style={{ width: "100%" }}>
      <View
        style={[BoxContainerCStyle, { width: imageSize, height: imageSize }]}
      >
        <SecondaryBox style={[{ height: imageSize - 2, width: imageSize - 2 }]}>
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
        </SecondaryBox>
      </View>
      <View style={{ width: imageSize }}>
        <View
          style={[
            CarouselRowCStyle,
            { backgroundColor: theme.headerBackgroundColor },
          ]}
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
                  marginHorizontal: layout.spacing_x0_25,
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const BoxContainerCStyle: ViewStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 9,
  },
  shadowOpacity: 0.5,
  shadowRadius: 12.35,

  elevation: 19,
};

const CarouselRowCStyle: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  justifyContent: "space-evenly",
  padding: 7,
  top: -30,
  position: "absolute",
  borderRadius: 10,
};
