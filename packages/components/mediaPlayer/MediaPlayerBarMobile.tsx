import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

import { MediaNameImage } from "./MediaNameImage";
import { TimerSliderMobile } from "./TimerSliderMobile";
import FullScreenIcon from "../../../assets/icons/media-player/full-screen.svg";
import LoopIcon from "../../../assets/icons/media-player/loop.svg";
import PauseIcon from "../../../assets/icons/media-player/pause_round.svg";
import PlayIcon from "../../../assets/icons/media-player/play_round.svg";
import RandomIcon from "../../../assets/icons/media-player/random.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
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

export const MediaPlayerBarMobile: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const {
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
    triggerVideoFullscreen,
  } = useMediaPlayer();

  if (!isMediaPlayerOpen) return null;
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2, // TODO: Adjust depending on mobile width ?
          height: 48,
          backgroundColor: neutral17,
          borderTopWidth: 1,
          borderTopColor: neutral22,
        }}
      >
        {/*TODO: Handle Prev for audios and Prev + Next for audios and videos */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            containerStyle={{
              height: "100%",
              justifyContent: "center",
              flex: 1,
            }}
            onSwipeableRightOpen={canPrev ? prevMedia : undefined}
            onSwipeableLeftOpen={canNext ? nextMedia : undefined}
          >
            <MediaNameImage style={{ width: "100%" }} />
          </Swipeable>
        </GestureHandlerRootView>
        <SpacerRow size={2} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CustomPressable onPress={() => setIsRandom((isRandom) => !isRandom)}>
            <SVG
              source={RandomIcon}
              height={20}
              width={20}
              color={isRandom ? secondaryColor : neutralA3}
            />
          </CustomPressable>
          <SpacerRow size={2} />

          {media?.isVideo ? (
            // The user will be redirected to the video's screen if he's not on it when clicking on this button
            <CustomPressable onPress={triggerVideoFullscreen}>
              <SVG
                source={FullScreenIcon}
                width={20}
                height={20}
                color={neutralA3}
              />
            </CustomPressable>
          ) : (
            <CustomPressable onPress={onToggleLoop}>
              <SVG
                source={LoopIcon}
                height={20}
                width={20}
                color={playbackStatus?.isLooping ? secondaryColor : neutralA3}
              />
            </CustomPressable>
          )}
          <SpacerRow size={2} />

          <CustomPressable onPress={handlePlayPause} disabled={!media}>
            <SVG
              source={
                playbackStatus?.isPlaying && !playbackStatus?.didJustFinish
                  ? PauseIcon
                  : PlayIcon
              }
              height={28}
              width={28}
              color={media ? secondaryColor : neutralA3}
            />
          </CustomPressable>
        </View>
      </View>
      <TimerSliderMobile playbackStatus={playbackStatus} />
    </View>
  );
};
