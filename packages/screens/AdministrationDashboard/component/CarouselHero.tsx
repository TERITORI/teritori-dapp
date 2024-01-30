import React, { useRef, useState } from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import guardianPng from "../../../../assets/default-images/guardian_1.png";
import { OptimizedImage } from "../../../components/OptimizedImage";
import {
  neutral00,
  neutral44,
  secondaryColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

const MD_BREAKPOINT = 820;

const data: string[] = [guardianPng, guardianPng, guardianPng];

export const CarouselHero = () => {
  const { width } = useWindowDimensions();
  const isBreakPoint = width >= MD_BREAKPOINT;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const carouselRef = useRef<ICarouselInstance | null>(null);

  return (
    <View
      style={[
        {
          marginRight: layout.spacing_x4,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        },
        isBreakPoint ? { flex: 1 } : { marginTop: layout.spacing_x2 },
      ]}
    >
      <Carousel
        ref={carouselRef}
        width={490}
        height={490}
        data={data}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        onProgressChange={(_, absoluteProgress) => {
          console.log("absoluteProgress", absoluteProgress);
          setCurrentPage(Math.round(absoluteProgress));
        }}
        autoPlay
        pagingEnabled
        autoPlayInterval={7000}
        renderItem={({ item, index }) => (
          <OptimizedImage
            width={490}
            height={490}
            sourceURI={item}
            key={`Carousel-${index}`}
            style={{ width: 490, height: 490, borderRadius: 12 }}
          />
        )}
      />
      {/* <Carousel
        loop
        width={492}
        height={490}
        autoPlay={false}
        data={data}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentPage(index)}
        renderItem={({ index }) => (
          <View style={{ paddingHorizontal: layout.spacing_x0_25 }}>
            <OptimizedImage
              sourceURI={guardianPng}
              style={{
                borderRadius: 12,
              }}
              height={490}
              width={490}
            />
          </View>
        )}
      /> */}
      <View style={pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[paginationDot, index === currentPage && activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const pagination: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: layout.spacing_x1_5,
  position: "absolute",
  bottom: 10,
  backgroundColor: neutral00,
  padding: layout.spacing_x1,
  borderRadius: 100,
};

const paginationDot: ViewStyle = {
  width: 8,
  height: 4,
  borderRadius: 4,
  marginRight: 4,
  backgroundColor: neutral44,
};

const activeDot: ViewStyle = {
  width: 16,
  backgroundColor: secondaryColor,
};
