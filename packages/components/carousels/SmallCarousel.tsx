import React, { useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Carousel, {
  ICarouselInstance,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { SVG } from "../SVG";
import FlexRow from "../containers/FlexRow";
import { InnerSideBlackShadow } from "../shadows/InnerSideBlackShadow";

const chevronSize = 16;

type ButtonProps = {
  onPress: () => void;
  shadowHeight: number;
  style?: StyleProp<ViewStyle>;
};

const PrevButton: React.FC<ButtonProps> = ({
  onPress,
  shadowHeight,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.buttonContainer, { left: 0 }, style]}
    >
      <InnerSideBlackShadow
        side="left"
        height={shadowHeight}
        style={styles.buttonShadow}
      >
        <SVG width={chevronSize} height={chevronSize} source={chevronLeftSVG} />
      </InnerSideBlackShadow>
    </TouchableOpacity>
  );
};

const NextButton: React.FC<ButtonProps> = ({
  onPress,
  shadowHeight,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    style={[styles.buttonContainer, { right: 0 }, style]}
  >
    <InnerSideBlackShadow
      side="right"
      height={shadowHeight}
      style={styles.buttonShadow}
    >
      <SVG width={chevronSize} height={chevronSize} source={chevronRightSVG} />
    </InnerSideBlackShadow>
  </TouchableOpacity>
);

export const SmallCarousel: React.FC<TCarouselProps & { height: number }> = (
  props
) => {
  const { children, width, height, style, data, ...carouselProps } = props;
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const viewWidth = StyleSheet.flatten(style)?.width;
  const step = Math.floor(
    (typeof viewWidth === "number" ? viewWidth : 0) / (width || 0)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = (index: number) => {
    setCurrentIndex(index);
  };
  const onPressPrev = () => {
    carouselRef.current?.prev({ count: step });
  };
  const onPressNext = () => {
    carouselRef.current?.next({ count: step });
  };

  return (
    <FlexRow>
      {!props.loop && currentIndex > 0 && (
        <PrevButton shadowHeight={height} onPress={onPressPrev} />
      )}
      <Carousel
        data={data}
        ref={carouselRef}
        style={style}
        width={width || 0}
        height={height || 0}
        onScrollEnd={onScrollEnd}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        {...carouselProps}
      />
      {!props.loop && currentIndex < data.length - 1 && (
        <NextButton shadowHeight={height} onPress={onPressNext} />
      )}
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    top: 0,
    zIndex: 10,
    position: "absolute",
  },
  buttonShadow: {
    justifyContent: "center",
    alignItems: "center",
  },
});
