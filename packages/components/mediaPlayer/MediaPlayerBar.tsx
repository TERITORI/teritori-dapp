import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { MediaNameImage } from "./MediaNameImage";
import { MediaPlayerBarMobile } from "./MediaPlayerBarMobile";
import { TimerSlider } from "./TimerSlider";
import { VolumeSlider } from "./VolumeSlider";
import LoopIcon from "../../../assets/icons/media-player/loop.svg";
import NextIcon from "../../../assets/icons/media-player/next.svg";
import PauseIcon from "../../../assets/icons/media-player/pause.svg";
import PlayIcon from "../../../assets/icons/media-player/play.svg";
import PreviousIcon from "../../../assets/icons/media-player/previous.svg";
import RandomIcon from "../../../assets/icons/media-player/random.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  neutral17,
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerRow } from "../spacer";

export const MediaPlayerBar: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const isMobile = useIsMobile();
  const {
    isPlaying,
    handlePlayPause,
    media,
    isRandom,
    setIsRandom,
    isMediaPlayerOpen,
    canPrev,
    canNext,
    nextMedia,
    prevMedia,
    onToggleLoop,
    playbackStatus,
  } = useMediaPlayer();

  if (!isMediaPlayerOpen) return null;
  if (isMobile) return <MediaPlayerBarMobile />;
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x3,
          height: 48,
          backgroundColor: neutral17,
          borderTopWidth: 1,
          borderTopColor: neutral22,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CustomPressable onPress={() => setIsRandom((isRandom) => !isRandom)}>
          <SVG
            source={RandomIcon}
            height={20}
            width={20}
            color={isRandom ? secondaryColor : neutralA3}
          />
        </CustomPressable>
        <SpacerRow size={2.5} />

        <CustomPressable onPress={prevMedia} disabled={!canPrev}>
          <SVG
            source={PreviousIcon}
            height={20}
            width={20}
            color={canPrev ? secondaryColor : neutralA3}
          />
        </CustomPressable>
        <SpacerRow size={2.5} />

        <CustomPressable onPress={handlePlayPause} disabled={!media}>
          <SVG
            source={
              isPlaying && !playbackStatus?.didJustFinish ? PauseIcon : PlayIcon
            }
            height={28}
            width={28}
            color={media ? secondaryColor : neutralA3}
          />
        </CustomPressable>
        <SpacerRow size={2.5} />

        <CustomPressable onPress={nextMedia} disabled={!canNext}>
          <SVG
            source={NextIcon}
            height={20}
            width={20}
            color={canNext ? secondaryColor : neutralA3}
          />
        </CustomPressable>
        <SpacerRow size={2.5} />

        <CustomPressable onPress={onToggleLoop}>
          <SVG
            source={LoopIcon}
            height={20}
            width={20}
            color={playbackStatus?.isLooping ? secondaryColor : neutralA3}
          />
        </CustomPressable>
        <SpacerRow size={4} />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TimerSlider />
        <SpacerRow size={4} />
        <MediaNameImage />
      </View>
      <VolumeSlider />
    </View>
  );
};
