import { useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  ICarouselInstance,
  TCarouselProps,
} from "react-native-reanimated-carousel";

export const useSmallCarousel = (
  props: TCarouselProps & { height: number },
) => {
  const {
    width = 0,
    height = 0,
    style,
    data,
    loop: isLoop = true,
    ...carouselProps
  } = props;

  const carouselRef = useRef<ICarouselInstance | null>(null);
  const viewWidth = StyleSheet.flatten(style)?.width;
  const step =
    width && typeof viewWidth === "number" ? Math.floor(viewWidth / width) : 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setScrolling] = useState(false);

  const onScrollEnd = (index: number) => {
    setCurrentIndex(index);
    // Prevent spamming buttons
    setScrolling(false);
  };

  const onPressPrev = () => {
    // No matter the carousel or items width, if it's the last press on Prev, we set "Reached the carousel's start"
    if (!isLoop && currentIndex - step <= 0) {
      carouselRef.current?.scrollTo({ index: 0, animated: true });
    } else {
      carouselRef.current?.prev({ count: step });
    }
  };
  const onPressNext = () => {
    // No matter the carousel or items width, if it's the last press on Next, we set "Reached the carousel's end"
    if (!isLoop && currentIndex + step >= data.length) {
      carouselRef.current?.scrollTo({ index: data.length - 1, animated: true });
    } else {
      carouselRef.current?.next({ count: step });
    }
  };

  const isPrevButtonEnabled = useMemo(
    () =>
      // The button always enabled if loop carousel
      (isLoop ||
        // If not loop, the button is disabled if the carousel is at start
        currentIndex > 0) &&
      // The button is always disabled if all items are visible (without doing next/prev)
      data.length > step,
    [isLoop, currentIndex, data.length, step],
  );
  const isNextButtonEnabled = useMemo(
    () => (isLoop || currentIndex < data.length - 1) && data.length > step,
    [isLoop, currentIndex, data.length, step],
  );

  return {
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
  };
};
