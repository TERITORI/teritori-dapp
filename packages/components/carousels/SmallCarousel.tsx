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
import FlexRow from "../FlexRow";
import { InnerSideBlackShadow } from "../shadows/InnerSideBlackShadow";

const chevronSize = 16;

type ButtonProps = {
  shadowHeight: number;
  onPress?: () => void;
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
  // loop is true by default in Carousel, so we need to override SmallCarousel props.loop like this
  const isLoop = props.loop === undefined || props.loop

  const carouselRef = useRef<ICarouselInstance | null>(null);
  const viewWidth = StyleSheet.flatten(style)?.width;
  const step = Math.floor(
    (typeof viewWidth === "number" ? viewWidth : 0) / (width || 0)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setScrolling] = useState(false);

  const onScrollEnd = () => {
    // Prevent spamming buttons
    setScrolling(false);
  };

  const onPressPrev = () => {
    // No matter the carousel or items width, if it's the last press on Prev, we set "Reached the carousel's start"
    if (!isLoop && currentIndex - step <= 0) {
      carouselRef.current?.scrollTo({ index: 0, animated: true });
      setCurrentIndex(0);
      setScrolling(false);
    } else {
      carouselRef.current?.prev({ count: step });
      setCurrentIndex(currentIndex - step);
    }
  };
  const onPressNext = () => {
    // No matter the carousel or items width, if it's the last press on Next, we set "Reached the carousel's end"
    if (!isLoop && currentIndex + step >= data.length) {
      carouselRef.current?.scrollTo({ index: data.length - 1, animated: true });
      setCurrentIndex(data.length - 1);
      setScrolling(false);
    } else {
      carouselRef.current?.next({ count: step });
      setCurrentIndex(currentIndex + step);
    }
  };

  return (
    <FlexRow>
      {(isLoop || (!isLoop && currentIndex > 0)) && (
        <PrevButton
          shadowHeight={height}
          onPress={!isScrolling ? onPressPrev : undefined}
        />
      )}
      <Carousel
        data={data}
        ref={carouselRef}
        style={style}
        width={width || 0}
        height={height || 0}
        onScrollBegin={() => setScrolling(true)}
        onScrollEnd={onScrollEnd}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        {...carouselProps}
      />
      {(isLoop || (!isLoop && currentIndex < data.length - 1)) && (
        <NextButton
          shadowHeight={height}
          onPress={!isScrolling ? onPressNext : undefined}
        />
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
