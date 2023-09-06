import React, { FC, useState } from "react";
import { TextStyle, View } from "react-native";
import Slider from "react-native-smooth-slider";

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

export const TimerSlider: FC = () => {
  const { media, lastTimePosition, onChangeTimerPosition } = useMediaPlayer();
  const [isSliderHovered, setIsSliderHovered] = useState(false);

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
            {getAudioDuration(lastTimePosition)}
          </BrandText>
        )}
      </View>
      <SpacerRow size={1} />
      <CustomPressable
        onHoverIn={() => setIsSliderHovered(true)}
        onHoverOut={() => setIsSliderHovered(false)}
      >
        <Slider
          value={lastTimePosition}
          onValueChange={onChangeTimerPosition}
          useNativeDriver
          thumbStyle={{
            width: isSliderHovered && media ? 12 : 0,
            height: isSliderHovered && media ? 12 : 0,
          }}
          thumbTintColor={secondaryColor}
          maximumValue={media?.duration}
          minimumTrackTintColor={
            isSliderHovered && media ? primaryColor : secondaryColor
          }
          maximumTrackTintColor={neutral55}
          style={{ width: 324, height: 4 }}
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
