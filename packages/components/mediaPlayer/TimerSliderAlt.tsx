import Slider from "@react-native-community/slider";
import React, { FC, useState } from "react";
import { View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold10 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn } from "../spacer";

import FlexRow from "@/components/FlexRow";

// Same as TimerSlider but with duration above the Slider
export const TimerSliderAlt: FC<{
  duration: number;
}> = ({ duration }) => {
  const { media, onChangeTimerPosition, playbackStatus } = useMediaPlayer();
  const [isHovered, setIsHovered] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <FlexRow justifyContent="space-between">
        <View style={{ alignItems: "flex-end" }}>
          <BrandText style={fontSemibold10}>
            {media
              ? prettyMediaDuration(playbackStatus?.positionMillis)
              : "00:00"}
          </BrandText>
        </View>

        <View>
          <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
            {prettyMediaDuration(duration)}
          </BrandText>
        </View>
      </FlexRow>
      <SpacerColumn size={0.5} />

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
          style={{ width: "100%", height: 4 }}
          disabled={!media}
        />
      </CustomPressable>
    </View>
  );
};
