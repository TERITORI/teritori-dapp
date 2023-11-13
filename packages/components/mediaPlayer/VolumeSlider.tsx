import Slider from "@react-native-community/slider";
import { AVPlaybackStatusSuccess } from "expo-av";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";

import VolumeIcon from "../../../assets/icons/media-player/volume.svg";
import VolumeAltIcon from "../../../assets/icons/media-player/volume_alt.svg";
import VolumeOffIcon from "../../../assets/icons/media-player/volume_off.svg";
import VolumeOffAltIcon from "../../../assets/icons/media-player/volume_off_alt.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";

export const VolumeSlider: FC<{
  useAltStyle?: boolean;
  playbackStatus?: AVPlaybackStatusSuccess;
}> = ({ useAltStyle, playbackStatus }) => {
  const { onChangeVolume } = useMediaPlayer();
  const [localVolume, setLocalVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  // Plug or not the playbackStatus.volume from MediaPLayerProvider
  const [volumeToUse, setVolumeToUse] = useState(1);
  useEffect(() => {
    if (!playbackStatus) setVolumeToUse(localVolume);
    else setVolumeToUse(playbackStatus?.volume);
  }, [playbackStatus, localVolume]);

  //FIXME: `NaN` is an invalid value for the `WebkitFlexGrow` css style property.

  // We store a lastVolume to handle mute/unmute by clicking on the volume icon, with retrieving the precedent volume
  const onPressVolumeIcon = () => {
    if (volumeToUse) {
      setLastVolume(volumeToUse);
      onChangeVolume(0);
      setLocalVolume(0);
    } else {
      onChangeVolume(lastVolume);
      setLocalVolume(lastVolume);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <CustomPressable
        onPress={onPressVolumeIcon}
        style={{ padding: layout.spacing_x1 }}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <SVG
          source={
            volumeToUse
              ? useAltStyle
                ? VolumeAltIcon
                : VolumeIcon
              : useAltStyle
                ? VolumeOffAltIcon
                : VolumeOffIcon
          }
          height={20}
          width={20}
          color={
            useAltStyle
              ? secondaryColor
              : isSliding || isHovered
                ? secondaryColor
                : neutralA3
          }
        />
      </CustomPressable>

      <CustomPressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Slider
          value={volumeToUse}
          onValueChange={(value: number) => {
            onChangeVolume(value);
            setLocalVolume(value);
          }}
          tapToSeek
          onSlidingStart={() => setIsSliding(true)}
          onSlidingComplete={() => setIsSliding(false)}
          // @ts-expect-error FIXME: thumbStyle only allowed in SliderPropsWindows
          thumbStyle={{
            width: isSliding || isHovered ? 12 : 0,
            height: isSliding || isHovered ? 12 : 0,
          }}
          thumbTintColor={secondaryColor}
          minimumTrackTintColor={
            isSliding || isHovered ? primaryColor : secondaryColor
          }
          maximumTrackTintColor={neutral55}
          style={{ width: 100, height: 4 }}
        />
      </CustomPressable>
    </View>
  );
};
