import { FC } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import Carousel, { TCarouselProps } from "react-native-reanimated-carousel";

import FlexRow from "../../FlexRow";
import { SVG } from "../../SVG";
import { InnerSideBlackShadow } from "../../shadows/InnerSideBlackShadow";

import chevronLeftSVG from "@/assets/icons/chevron-left.svg";
import chevronRightSVG from "@/assets/icons/chevron-right.svg";
import { useSmallCarousel } from "@/components/carousels/SmallCarousel/useSmallCarousel";

const CHEVRON_SIZE = 16;

type ButtonProps = {
  shadowHeight: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const PrevButton: FC<ButtonProps> = ({ onPress, shadowHeight, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[buttonContainerCStyle, { left: 0 }, style]}
    >
      <InnerSideBlackShadow
        side="left"
        height={shadowHeight}
        style={buttonShadowCStyle}
      >
        <SVG
          width={CHEVRON_SIZE}
          height={CHEVRON_SIZE}
          source={chevronLeftSVG}
        />
      </InnerSideBlackShadow>
    </TouchableOpacity>
  );
};

const NextButton: FC<ButtonProps> = ({ onPress, shadowHeight, style }) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    style={[buttonContainerCStyle, { right: 0 }, style]}
  >
    <InnerSideBlackShadow
      side="right"
      height={shadowHeight}
      style={buttonShadowCStyle}
    >
      <SVG
        width={CHEVRON_SIZE}
        height={CHEVRON_SIZE}
        source={chevronRightSVG}
      />
    </InnerSideBlackShadow>
  </TouchableOpacity>
);

export const SmallCarousel: FC<TCarouselProps & { height: number }> = (
  props,
) => {
  const {
    carouselRef,
    setScrolling,
    width,
    height,
    style,
    data,
    carouselProps,
    isScrolling,
    onScrollEnd,
    onPressPrev,
    onPressNext,
    isPrevButtonEnabled,
    isNextButtonEnabled,
  } = useSmallCarousel(props);

  return (
    <FlexRow>
      {isPrevButtonEnabled && (
        <PrevButton
          shadowHeight={height}
          onPress={!isScrolling ? onPressPrev : undefined}
        />
      )}
      <Carousel
        data={data}
        ref={carouselRef}
        style={style}
        width={width}
        height={height}
        onScrollStart={() => setScrolling(true)}
        onScrollEnd={onScrollEnd}
        onConfigurePanGesture={(g) => g.enableTrackpadTwoFingerGesture(true)}
        {...carouselProps}
      />
      {isNextButtonEnabled && (
        <NextButton
          shadowHeight={height}
          onPress={!isScrolling ? onPressNext : undefined}
        />
      )}
    </FlexRow>
  );
};

const buttonContainerCStyle: ViewStyle = {
  top: 0,
  zIndex: 10,
  position: "absolute",
};
const buttonShadowCStyle: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
};
