import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import Slider from "react-native-smooth-slider";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { neutral55, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SpacerRow } from "../spacer";

export const TimerSlider: FC = () => {
  const { media, setTimePosition, lastTimePosition } = useMediaPlayer();

  return (
    <View style={styles.container}>
      <View style={{ width: 46, alignItems: "flex-end" }}>
        {!!media?.duration && (
          <BrandText style={styles.timeText}>
            {prettyTime(lastTimePosition)}
          </BrandText>
        )}
      </View>
      <SpacerRow size={1} />
      <Slider
        value={lastTimePosition}
        onValueChange={(value: number) => setTimePosition(value)}
        useNativeDriver
        thumbStyle={{ width: 0, height: 0 }}
        thumbTouchSize={{ width: 24, height: 24 }}
        maximumValue={media?.duration}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={neutral55}
        style={{ width: 324, height: 4 }}
        disabled={!media?.duration}
      />
      <SpacerRow size={1} />
      <View style={{ width: 40 }}>
        {!!media?.duration && (
          <BrandText style={styles.timeText}>
            {prettyTime(media?.duration)}
          </BrandText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: StyleSheet.flatten([
    fontSemibold12,
    {
      color: neutral77,
    },
  ]),
});

// time in ms
const prettyTime = (time: number) => {
  const seconds = time / 1000;
  const minutes = Math.floor(seconds / 60);
  const extraSeconds = seconds % 60;
  const minutesStr =
    minutes < 10 ? "0" + Math.floor(minutes).toString() : minutes.toString();
  const extraSecondsStr =
    extraSeconds < 10
      ? "0" + Math.floor(extraSeconds).toString()
      : Math.floor(extraSeconds).toString();
  return minutesStr + ":" + extraSecondsStr;
};
