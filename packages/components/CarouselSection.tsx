import React, { useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import Carousel, {
  ICarouselInstance,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import { SVG } from "./SVG";
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
        <SVG width={16} height={16} source={chevronLeftSVG} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => carouselRef.current?.next()}>
        <SVG width={16} height={16} source={chevronRightSVG} />
      </TouchableOpacity>
    </View>
  );
  return (
    <Section title={title} topRightChild={topRightChild}>
      <Carousel ref={carouselRef} {...carouselProps} />
    </Section>
  );
};
