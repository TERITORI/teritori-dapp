import Slider from "@react-native-community/slider";
import React, { FC, useState } from "react";
import { View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { neutral55, secondaryColor } from "../../utils/style/colors";

export const TimerSliderMobile: FC = () => {
  const [width, setWidth] = useState(0);
  const { media, playbackStatus, onChangeTimerPosition } = useMediaPlayer();

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
        maximumValue={media?.duration}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={neutral55}
        //TODO: Increase bar height is isSliding. By extension, change style, remove borderRadius etc. But this style prop doesn't allow to style the bar :'(
        style={{ width }}
        disabled={!media}
      />
    </View>
  );
};
