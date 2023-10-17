import { useState } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { AudioWaveformProps } from "./AudioWaveform.type";
import { BAR_LENGTH, generateBars } from "../../../utils/audio";
import { neutral55, secondaryColor } from "../../../utils/style/colors";

const BAR_WIDTH = 3;
export const AUDIO_WAVEFORM_MAX_WIDTH = 600;

export const AudioWaveform = ({
  waveform,
  positionPercent = 0,
  style,
}: AudioWaveformProps) => {
  const [width, setWidth] = useState(0);
  const animatedStyles = useAnimatedStyle(() => {
    const currentIndex = Math.round(positionPercent * BAR_LENGTH);
    const totalVisibleBars = Math.round(width / BAR_WIDTH);
    const animationStartIndex = Math.round(totalVisibleBars / BAR_WIDTH);
    const animationStopIndex =
      animationStartIndex + (BAR_LENGTH - totalVisibleBars);

    const isToTranslate =
      totalVisibleBars < BAR_LENGTH && currentIndex > animationStartIndex;

    const translationValue =
      currentIndex > animationStopIndex
        ? (animationStopIndex - animationStartIndex) * BAR_WIDTH
        : (currentIndex - animationStartIndex) * BAR_WIDTH;

    return {
      transform: [
        {
          translateX: withSpring(isToTranslate ? -translationValue : 0),
        },
      ],
    };
  }, [positionPercent, width]);

  return (
    <Animated.View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[
        animatedStyles,
        {
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
          maxWidth: AUDIO_WAVEFORM_MAX_WIDTH,
        },
        style,
      ]}
    >
      {generateBars(waveform).map((item, index) => (
        <Animated.View
          key={index}
          style={{
            width: BAR_WIDTH - 1,
            // Avoid empty space by setting a minimal bars height if no sound
            height: item < 1 ? 1 : item,
            marginRight: 1,
            backgroundColor:
              index < Math.round(positionPercent * BAR_LENGTH)
                ? secondaryColor
                : neutral55,
          }}
        />
      ))}
    </Animated.View>
  );
};
