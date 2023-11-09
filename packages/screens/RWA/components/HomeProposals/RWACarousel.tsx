import React from "react";
import { View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSelector } from "react-redux";

import RealEstatePlaceholder from "../../../../../assets/default-images/real-estate-placeholder.png";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { selectIsLightTheme } from "../../../../store/slices/settings";

const data: string[] = [
  RealEstatePlaceholder,
  RealEstatePlaceholder,
  RealEstatePlaceholder,
];

export const RWACarousel: React.FC = () => {
  const [index, handleIndex] = React.useState<number>(0);
  const isLightTheme = useSelector(selectIsLightTheme);
  const imageSize = 464;
  const carouselRef = React.useRef<ICarouselInstance | null>(null);

  return (
    <View style={{ width: "100%", flex: 1 }}>
      <TertiaryBox
        mainContainerStyle={{
          borderColor: isLightTheme ? "#FFFFFF" : "#000000",
          backgroundColor: isLightTheme ? "#FFFFFF" : "#000000",

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
        squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
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
            backgroundColor: "#FFF",
            borderRadius: 10,
          }}
        >
          {data.map((_, indexData) => {
            return (
              <View
                key={`Index-${indexData}`}
                style={{
                  backgroundColor: index === indexData ? "#000" : "#C5C5C5",
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
