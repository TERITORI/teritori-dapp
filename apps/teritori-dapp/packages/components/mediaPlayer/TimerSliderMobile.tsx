import Slider from "@react-native-community/slider";
import { AVPlaybackStatusSuccess } from "expo-av";
import React, { FC, useState } from "react";
import { View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { neutral55, secondaryColor } from "../../utils/style/colors";

export const TimerSliderMobile: FC<{
  playbackStatus?: AVPlaybackStatusSuccess;
}> = ({ playbackStatus }) => {
  const [width, setWidth] = useState(0);
  const { media, onChangeTimerPosition } = useMediaPlayer();

  return (
    <View
      style={{ flexDirection: "row", width: "100%" }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <Slider
        onSlidingComplete={(a: number) => onChangeTimerPosition(a)}
        value={playbackStatus?.positionMillis}
        tapToSeek
        // @ts-expect-error FIXME: thumbStyle only allowed in SliderPropsWindows
        thumbStyle={{
          width: 0,
          height: 0,
        }}
        thumbTintColor={secondaryColor}
        maximumValue={playbackStatus?.durationMillis || media?.duration}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={neutral55}
        //TODO: Increase bar height is isSliding. By extension, change style, remove borderRadius etc. But this style prop doesn't allow to style the bar :'(
        style={{ width }}
        disabled={!media}
      />
    </View>
  );
};
