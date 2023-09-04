import Slider from "@react-native-community/slider";
import React, { FC, useState } from "react";
import { TextStyle, View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { getAudioDuration } from "../../utils/audio";
import {
  neutral55,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerRow } from "../spacer";

export const TimerSlider: FC<{
  width?: number;
}> = ({ width = 324 }) => {
  const { media, playbackStatus, onChangeTimerPosition } = useMediaPlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ width: 46, alignItems: "flex-end" }}>
        {media && (
          <BrandText style={timeTextStyle}>
            {getAudioDuration(playbackStatus?.positionMillis)}
          </BrandText>
        )}
      </View>
      <SpacerRow size={1} />
      <CustomPressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Slider
          onSlidingStart={() => setIsSliding(true)}
          onSlidingComplete={(a: number) => {
            onChangeTimerPosition(a);
            setIsSliding(false);
          }}
          value={playbackStatus?.positionMillis}
          tapToSeek
          // @ts-expect-error FIXME: thumbStyle only allowed in SliderPropsWindows
          thumbStyle={{
            width: (isSliding || isHovered) && media ? 12 : 0,
            height: (isSliding || isHovered) && media ? 12 : 0,
          }}
          thumbTintColor={secondaryColor}
          maximumValue={media?.duration}
          minimumTrackTintColor={
            (isSliding || isHovered) && media ? primaryColor : secondaryColor
          }
          maximumTrackTintColor={neutral55}
          style={{ width, height: 4 }}
          disabled={!media}
        />
      </CustomPressable>
      <SpacerRow size={1} />
      <View style={{ width: 40 }}>
        {!!media?.duration && (
          <BrandText style={timeTextStyle}>
            {getAudioDuration(media.duration)}
          </BrandText>
        )}
      </View>
    </View>
  );
};

const timeTextStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
};
