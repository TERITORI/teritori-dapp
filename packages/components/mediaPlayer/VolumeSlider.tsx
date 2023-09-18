import Slider from "@react-native-community/slider";
import React, { FC, useState } from "react";
import { View } from "react-native";

import VolumeIcon from "../../../assets/icons/media-player/volume.svg";
import VolumeOffIcon from "../../../assets/icons/media-player/volume_off.svg";
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

export const VolumeSlider: FC = () => {
  const { onChangeVolume } = useMediaPlayer();
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  //FIXME: `NaN` is an invalid value for the `WebkitFlexGrow` css style property.

  // We store a lastVolume to handle mute/unmute by clicking on the volume icon, with retrieving the precedent volume
  const onPressVolumeIcon = () => {
    if (volume) {
      setLastVolume(volume);
      onChangeVolume(0);
      setVolume(0);
    } else {
      onChangeVolume(lastVolume);
      setVolume(lastVolume);
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
          source={volume ? VolumeIcon : VolumeOffIcon}
          height={20}
          width={20}
          color={isSliding || isHovered ? secondaryColor : neutralA3}
        />
      </CustomPressable>

      <CustomPressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <Slider
          value={volume}
          onValueChange={(value: number) => {
            onChangeVolume(value);
            setVolume(value);
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
