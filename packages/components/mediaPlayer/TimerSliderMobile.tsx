import React, { FC } from "react";
import Slider from "react-native-smooth-slider";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { neutral55, secondaryColor } from "../../utils/style/colors";

export const TimerSliderMobile: FC = () => {
  const { media, lastTimePosition, onChangeTimerPosition } = useMediaPlayer();

  return (
    <Slider
      value={lastTimePosition}
      onValueChange={onChangeTimerPosition}
      useNativeDriver
      thumbStyle={{ width: 0, height: 0 }}
      maximumValue={media?.duration}
      minimumTrackTintColor={secondaryColor}
      maximumTrackTintColor={neutral55}
      style={{ height: 4, overflow: "hidden" }}
      trackStyle={{ borderRadius: 0 }}
      disabled
    />
  );
};
