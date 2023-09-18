import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useMemo, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { getAudioDuration } from "../../utils/audio";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  errorColor,
  neutral00,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";
import { RemoteFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

const THUMBNAIL_SIZE = 140;

export const AudioView: React.FC<{
  file: RemoteFileData;
  maxWidth?: number;
}> = ({ file, maxWidth }) => {
  const { width } = useMaxResolution();
  const [sound, setSound] = useState<Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>();
  const duration = useMemo(
    () => getAudioDuration(file.audioMetadata?.duration),
    [file]
  );

  const handlePlayPause = async () => {
    if (playbackStatus?.isLoaded && playbackStatus?.isPlaying) {
      await sound?.pauseAsync();
    } else {
      await sound?.playAsync();
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: ipfsURLToHTTPURL(file.url) },
        { progressUpdateIntervalMillis: 400 },
        (status) => setPlaybackStatus(status)
      );
      setSound(sound);
    };
    loadSound();
  }, [file.url]);

  const hasThumbnail = useMemo(
    () => typeof file?.thumbnailFileData?.url === "string",
    [file?.thumbnailFileData?.url]
  );

  const audioWaveWidth = useMemo(() => {
    if (width > screenContentMaxWidth) {
      return screenContentMaxWidth - 212 - (hasThumbnail ? THUMBNAIL_SIZE : 0);
    } else {
      return width - 212 - (hasThumbnail ? THUMBNAIL_SIZE : 0);
    }
  }, [width, hasThumbnail]);

  const positionPercent = useMemo(
    () =>
      ((playbackStatus?.isLoaded && playbackStatus?.positionMillis) || 0) /
      ((playbackStatus?.isLoaded && playbackStatus?.durationMillis) || 1),
    [playbackStatus]
  );

  if (!file?.url)
    return (
      <BrandText style={[fontSemibold13, { color: errorColor }]}>
        Audio not found
      </BrandText>
    );
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
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
        {playbackStatus?.isLoaded && playbackStatus?.isBuffering ? (
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

      <View
        style={{
          marginLeft: layout.spacing_x1_5,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ maxWidth: AUDIO_WAVEFORM_MAX_WIDTH, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <BrandText style={[fontSemibold14]}>
                {getAudioDuration(
                  (playbackStatus?.isLoaded &&
                    playbackStatus?.positionMillis) ||
                    0
                )}
              </BrandText>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {duration}
              </BrandText>
            </View>
            <View
              style={{
                overflow: "hidden",
                width: maxWidth || audioWaveWidth,
              }}
            >
              <AudioWaveform
                waveFormContainerWidth={maxWidth || audioWaveWidth}
                waveform={file.audioMetadata?.waveform || []}
                positionPercent={positionPercent}
                duration={
                  playbackStatus?.isLoaded
                    ? playbackStatus?.durationMillis || 0
                    : 1
                }
              />
            </View>
          </View>

          {hasThumbnail && (
            <Image
              source={{
                uri: ipfsURLToHTTPURL(file?.thumbnailFileData?.url || ""),
              }}
              resizeMode="cover"
              style={{
                height: THUMBNAIL_SIZE,
                width: THUMBNAIL_SIZE,
                marginLeft: layout.spacing_x1,
                borderRadius: 4,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
