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
  const { onChangeVolume } = useMediaPlayer();
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);

  // We store a lastVolume to handle mute/unmute by clicking on the volume icon, with retrieving the precedent volume
  const onPressVolumeIcon = () => {
    if (volume) {
      onChangeVolume(0);
      setVolume(0);
    } else {
      onChangeVolume(lastVolume);
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
          onChangeVolume(value);
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
