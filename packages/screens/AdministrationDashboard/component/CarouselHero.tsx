import React, { useState } from "react";
import { Image, View, ViewStyle, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import guardianPng from "../../../../assets/default-images/guardian_1.png";
import {
  neutral00,
  neutral44,
  secondaryColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

const MD_BREAKPOINT = 820;

export const CarouselHero = () => {
  const { width } = useWindowDimensions();
  const heroData = [...new Array(6).keys()];
  const isBreakPoint = width >= MD_BREAKPOINT;
  const [currentPage, setCurrentPage] = useState<number>(0);

  return (
    <View
      style={[
        {
          marginRight: layout.spacing_x4,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        },
        isBreakPoint ? { flex: 1 } : { marginTop: 16 },
      ]}
    >
      <Carousel
        loop
        width={490}
        height={490}
        autoPlay={false}
        data={heroData}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentPage(index)}
        renderItem={({ index }) => (
          <View style={{ paddingHorizontal: layout.spacing_x0_25 }}>
            <Image
              style={{
                width: 490,
                height: 490,
                borderRadius: 12,
              }}
              source={guardianPng}
            />
          </View>
        )}
      />
      <View style={pagination}>
        {heroData.map((_, index) => (
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
  marginTop: 10,
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
