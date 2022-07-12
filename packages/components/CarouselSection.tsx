import React, { useRef } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Carousel, {
  ICarouselInstance,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import chevronLeftPNG from "../../assets/icons/chevron-left.png";
import chevronRightPNG from "../../assets/icons/chevron-right.png";
import { Section } from "./Section";

export const CarouselSection: React.FC<
  {
    title: string;
  } & TCarouselProps
> = (props) => {
  const carouselRef = useRef<ICarouselInstance>();
  const { children, title, ...carouselProps } = props;

  const topRightChild = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => carouselRef.current?.prev()}
        style={{ marginRight: 24 }}
      >
        <Image
          source={chevronLeftPNG}
          style={{ width: 16, height: 16, resizeMode: "stretch" }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => carouselRef.current?.next()}>
        <Image
          source={chevronRightPNG}
          style={{ width: 16, height: 16, resizeMode: "stretch" }}
        />
      </TouchableOpacity>
    </View>
  );
  return (
    <Section title={title} topRightChild={topRightChild}>
      <Carousel ref={carouselRef} {...carouselProps} />
    </Section>
  );
};
