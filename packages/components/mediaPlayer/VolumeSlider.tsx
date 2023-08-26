import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import Slider from "react-native-smooth-slider";

import VolumeIcon from "../../../assets/icons/media-player/volume.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerRow } from "../spacer";

export const VolumeSlider: FC = () => {
  const { volume, setVolume } = useMediaPlayer();
  const [lastVolume, setLastVolume] = useState(volume);
  // We store a lastVolume to handle mute/unmute by clicking on the volume icon
  const onPressVolumeIcon = () => {
    if (volume) {
      setVolume(0);
    } else {
      setVolume(lastVolume);
    }
  };

  return (
    <View style={styles.container}>
      <CustomPressable onPress={onPressVolumeIcon}>
        <SVG
          source={VolumeIcon}
          height={20}
          width={20}
          color={volume ? secondaryColor : neutralA3}
        />
      </CustomPressable>
      <SpacerRow size={1} />
      <Slider
        value={lastVolume}
        onValueChange={(value: number) => {
          setVolume(value);
          setLastVolume(value);
        }}
        useNativeDriver
        thumbStyle={{ width: 12, height: 12 }}
        thumbTouchSize={{ width: 24, height: 24 }}
        thumbTintColor={secondaryColor}
        thum
        maximumValue={1}
        minimumTrackTintColor={volume ? primaryColor : neutralA3}
        maximumTrackTintColor={neutral55}
        style={{ width: 100, height: 4 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
