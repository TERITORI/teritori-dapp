import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { AudioWaveformProps } from "./AudioWaveform.type";
import { neutral55, secondaryColor } from "../../../utils/style/colors";
import { BAR_LENGTH, generateBars } from "../../../utils/waveform";

const BAR_WIDTH = 3;

export const AudioWaveform = ({
  waveform,
  positionPercent = 0,
  style,
  waveFormContainerWidth: width,
}: AudioWaveformProps) => {
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
  }, [positionPercent]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flexDirection: "row",
          alignItems: "flex-end",
          width,
        },
        style,
      ]}
    >
      {generateBars(waveform).map((item, index) => (
        <Animated.View
          key={index}
          style={{
            width: BAR_WIDTH - 1,
            height: item,
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
