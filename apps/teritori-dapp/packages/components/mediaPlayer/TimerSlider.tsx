import Slider from "@react-native-community/slider";
import { AVPlaybackStatusSuccess } from "expo-av";
import React, { FC, useState } from "react";
import { TextStyle, View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
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
  hideDuration?: boolean;
  playbackStatus?: AVPlaybackStatusSuccess;
}> = ({ hideDuration, playbackStatus, width = 324 }) => {
  const { media, onChangeTimerPosition } = useMediaPlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {!hideDuration && (
        <>
          <View style={{ width: 46, alignItems: "flex-end" }}>
            {media && (
              <BrandText style={timeTextStyle}>
                {prettyMediaDuration(playbackStatus?.positionMillis)}
              </BrandText>
            )}
          </View>
          <SpacerRow size={1} />
        </>
      )}

      <CustomPressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Slider
          onSlidingStart={() => setIsSliding(true)}
          onSlidingComplete={(value: number) => {
            onChangeTimerPosition(value);
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
          maximumValue={playbackStatus?.durationMillis || media?.duration}
          minimumTrackTintColor={
            (isSliding || isHovered) && media ? primaryColor : secondaryColor
          }
          maximumTrackTintColor={neutral55}
          style={{ width, height: 4 }}
          disabled={!media}
        />
      </CustomPressable>

      {!hideDuration && (
        <>
          <SpacerRow size={1} />
          <View style={{ width: 40 }}>
            {(!!playbackStatus?.durationMillis || !!media?.duration) && (
              <BrandText style={timeTextStyle}>
                {prettyMediaDuration(
                  playbackStatus?.durationMillis || media?.duration,
                )}
              </BrandText>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const timeTextStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
};
