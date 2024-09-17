import { FC } from "react";
import { View, ViewStyle } from "react-native";
import Carousel, { TCarouselProps } from "react-native-reanimated-carousel";

import { SVG } from "../../SVG";

import chevronLeftSVG from "@/assets/icons/chevron-left.svg";
import chevronRightSVG from "@/assets/icons/chevron-right.svg";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { useSmallCarousel } from "@/components/carousels/SmallCarousel/useSmallCarousel";
import { SpacerRow } from "@/components/spacer";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

// SmallCarousel but with rounded buttons instead of shadowed sides buttons

const chevronSize = 16;

type ButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

const PrevButton: FC<ButtonProps> = ({ onPress, disabled }) => {
  return (
    <CustomPressable
      style={[leftRightButtonCStyle, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <SVG
        source={chevronLeftSVG}
        style={{ width: chevronSize, height: chevronSize }}
      />
    </CustomPressable>
  );
};

const NextButton: FC<ButtonProps> = ({ onPress, disabled }) => (
  <CustomPressable
    style={[leftRightButtonCStyle, disabled && { opacity: 0.6 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <SVG
      source={chevronRightSVG}
      style={{ width: chevronSize, height: chevronSize }}
    />
  </CustomPressable>
);

export const SmallCarouselAlt: React.FC<TCarouselProps & { height: number }> = (
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
    isPrevButtonDisplayed,
    isNextButtonDisplayed,
  } = useSmallCarousel(props);

  return (
    <View>
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
      {data.length > 1 && (
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            top: layout.spacing_x1,
            right: layout.spacing_x1,
          }}
        >
          <PrevButton
            onPress={!isScrolling ? onPressPrev : undefined}
            disabled={!isPrevButtonDisplayed}
          />
          <SpacerRow size={1} />
          <NextButton
            onPress={!isScrolling ? onPressNext : undefined}
            disabled={!isNextButtonDisplayed}
          />
        </View>
      )}
    </View>
  );
};

const leftRightButtonCStyle: ViewStyle = {
  borderRadius: 999,
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: neutral33,
};
