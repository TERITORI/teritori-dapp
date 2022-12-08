import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { neutral00, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { AudioWaveform } from "./AudioWavefrom";
import { FileViewerProps } from "./FilePreview.type";

const getDuration = (millis: number | undefined) => {
  if (!millis) {
    return "00:00";
  }

  const totalSec = millis / 1000;

  let hours: string | number = Math.floor(totalSec / 3600);
  let minutes: string | number = Math.floor((totalSec - hours * 3600) / 60);
  let seconds: string | number = Math.floor(
    totalSec - hours * 3600 - minutes * 60
  );

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  const minuteDuration = minutes + ":" + seconds;

  return Number(hours) ? hours + ":" + minuteDuration : minuteDuration;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const AudioPreview: React.FC<FileViewerProps> = ({ fileURL }) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>();
  const [isLoaded, setLoaded] = useState(false);

  const loadFix = async (sound: Audio.Sound) => {
    try {
      await sound?.playAsync();
      await sleep(2000);
      await sound?.pauseAsync();
      await sound?.setPositionAsync(0);
      setLoaded(true);
      await sound?.setVolumeAsync(1);
    } catch (err) {
      console.log(err);
    }
  };

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileURL },
      { progressUpdateIntervalMillis: 400, volume: 0 },
      (status) => setPlaybackStatus(status)
    );
    setSound(sound);
    await loadFix(sound);
  };

  const handlePlayPause = async () => {
    if (playbackStatus?.isLoaded && playbackStatus.isPlaying) {
      await sound?.pauseAsync();
    } else {
      await sound?.playAsync();
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    loadSound();
  }, []);
  return (
    <View
      style={{
        padding: layout.padding_x1,
        flexDirection: "row",
        alignItems: "center",
        width: 300,
      }}
    >
      <TouchableOpacity
        onPress={handlePlayPause}
        activeOpacity={0.9}
        style={{
          backgroundColor:
            playbackStatus?.isLoaded && playbackStatus?.isPlaying
              ? secondaryColor
              : neutral00,
          height: 40,
          width: 40,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isLoaded ||
        (playbackStatus?.isLoaded && playbackStatus?.isBuffering) ? (
          <ActivityIndicator size={14} color={secondaryColor} />
        ) : (
          <SVG
            source={
              playbackStatus?.isLoaded && playbackStatus?.isPlaying
                ? pauseSVG
                : playSVG
            }
            width={24}
            height={24}
            color={
              playbackStatus?.isLoaded && playbackStatus?.isPlaying
                ? neutral00
                : secondaryColor
            }
          />
        )}
      </TouchableOpacity>

      {playbackStatus?.isLoaded && isLoaded && (
        <View
          style={{
            marginLeft: layout.padding_x1_5,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <BrandText style={[fontSemibold14]}>
              {getDuration(playbackStatus.positionMillis)}
            </BrandText>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {getDuration(playbackStatus.durationMillis)}
            </BrandText>
          </View>
          <AudioWaveform
            fileURL={fileURL}
            positionPercent={
              playbackStatus.positionMillis /
              (playbackStatus.durationMillis || 1)
            }
          />
        </View>
      )}
    </View>
  );
};
