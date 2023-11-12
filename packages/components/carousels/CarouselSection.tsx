import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Carousel, {
  ICarouselInstance,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { SVG } from "../SVG";
import { Section } from "../Section";

export const CarouselSection: React.FC<
  {
    title: string;
  } & TCarouselProps
> = (props) => {
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const { title, width, style, data, ...carouselProps } = props;
  const viewWidth = StyleSheet.flatten(style).width;
  const step = Math.floor(
    (typeof viewWidth === "number" ? viewWidth : 0) / (width || 0),
  );
  const navRef = useRef(false);

  const topRightChild = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => {
          if (!carouselRef.current || navRef.current || step === 0) {
            return;
          }
          navRef.current = true;
          let finalStep = step;
          if (carouselRef.current.getCurrentIndex() < finalStep) {
            finalStep = carouselRef.current.getCurrentIndex() || 0;
          }
          if (finalStep === 0) {
            navRef.current = false;
            return;
          }
          carouselRef.current.prev({
            count: finalStep,
            onFinished: () => (navRef.current = false),
          });
        }}
        style={{ marginRight: 24 }}
      >
        <SVG width={16} height={16} source={chevronLeftSVG} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (!carouselRef.current || navRef.current || step === 0) {
            return;
          }
          navRef.current = true;
          const finalStep = step;
          const remaining = data.length - carouselRef.current.getCurrentIndex();
          if (remaining <= finalStep) {
            navRef.current = false;
            return;
          }
          if (finalStep === 0) {
            navRef.current = false;
            return;
          }
          carouselRef.current.next({
            count: finalStep,
            onFinished: () => (navRef.current = false),
          });
        }}
      >
        <SVG width={16} height={16} source={chevronRightSVG} />
      </TouchableOpacity>
    </View>
  );
  return (
    <Section
      title={title}
      topRightChild={props.pagingEnabled ? topRightChild : null}
    >
      <Carousel
        data={data}
        ref={carouselRef}
        style={style}
        width={width || 0}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        {...carouselProps}
      />
    </Section>
  );
};
