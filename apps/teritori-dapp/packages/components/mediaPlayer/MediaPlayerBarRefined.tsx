import { AVPlaybackStatusSuccess } from "expo-av";
import React, { FC } from "react";
import { View } from "react-native";

import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerRow } from "../spacer";

import pauseSVG from "@/assets/icons/pause.svg";
import playSVG from "@/assets/icons/play.svg";
import { TimerSliderAlt } from "@/components/mediaPlayer/TimerSliderAlt";
import { secondaryColor } from "@/utils/style/colors";
export const MediaPlayerBarRefined: FC<{
  playbackStatus?: AVPlaybackStatusSuccess;
  onPressPlayPause: () => void;
  isInMediaPlayer: boolean;
}> = ({ playbackStatus, onPressPlayPause }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      }}
    >
      <CustomPressable onPress={onPressPlayPause}>
        <SVG
          source={
            playbackStatus?.isPlaying && !playbackStatus?.didJustFinish
              ? pauseSVG
              : playSVG
          }
          color={secondaryColor}
          width={24}
          height={24}
        />
      </CustomPressable>
      <SpacerRow size={0.5} />

      <TimerSliderAlt
        duration={playbackStatus?.durationMillis || 0}
        playbackStatus={playbackStatus}
      />
    </View>
  );
};
