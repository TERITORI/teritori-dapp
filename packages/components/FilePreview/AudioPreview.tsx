import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useMemo, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { getAudioDuration } from "../../utils/audio";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral00, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { RemoteFileData } from "../../utils/types/feed";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { AudioWaveform } from "./AudioWaveform";

const THUMBNAIL_WIDTH = 180;

const getWidth = (width: number, hasThumbnail: boolean) => {
  if (width > 900) {
    return 900 - 380 - (hasThumbnail ? THUMBNAIL_WIDTH : 0);
  } else {
    return width - 380 - (hasThumbnail ? THUMBNAIL_WIDTH : 0);
  }
};

export const AudioPreview = ({ file }: { file: RemoteFileData }) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>();
  const duration = useMemo(
    () => getAudioDuration(file.audioMetadata?.duration),
    [file]
  );

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: ipfsURLToHTTPURL(file.url) },
      { progressUpdateIntervalMillis: 400 },
      (status) => setPlaybackStatus(status)
    );
    setSound(sound);
  };

  const handlePlayPause = async () => {
    if (playbackStatus?.isLoaded && playbackStatus?.isPlaying) {
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

  React.useEffect(() => {
    loadSound();
  }, []);

  const positionPercent =
    ((playbackStatus?.isLoaded && playbackStatus?.positionMillis) || 0) /
    ((playbackStatus?.isLoaded && playbackStatus?.durationMillis) || 1);

  const { width } = useMaxResolution();

  const hasThumbnail = typeof file?.thumbnailFileData?.url === "string";
  return (
    <View
      style={{
        paddingVertical: layout.padding_x3,
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
          marginLeft: layout.padding_x1_5,
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
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                marginLeft: layout.padding_x1_5,
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
                width: getWidth(width, hasThumbnail),
              }}
            >
              <AudioWaveform
                waveFormContainerWidth={getWidth(width, hasThumbnail)}
                waveform={file.audioMetadata?.waveform || []}
                positionPercent={positionPercent}
                duration={
                  playbackStatus?.isLoaded
                    ? playbackStatus?.durationMillis || 0
                    : 1
                }
                currentDuration={
                  playbackStatus?.isLoaded ? playbackStatus?.positionMillis : 0
                }
              />
            </View>
          </View>

          {hasThumbnail && (
            <Image
              source={{
                uri: ipfsURLToHTTPURL(file?.thumbnailFileData?.url || ""),
              }}
              resizeMode="contain"
              style={{
                height: THUMBNAIL_WIDTH,
                width: THUMBNAIL_WIDTH,
                marginLeft: layout.padding_x1,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
