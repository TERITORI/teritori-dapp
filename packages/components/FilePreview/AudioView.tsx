import React, { useMemo } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { getAudioDuration } from "../../utils/audio";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  errorColor,
  neutral00,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { RemoteFileData } from "../../utils/types/files";
import { Media } from "../../utils/types/mediaPlayer";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

const THUMBNAIL_SIZE = 140;

export const AudioView: React.FC<{
  file: RemoteFileData;
  authorId: string;
  postId: string;
}> = ({ file, authorId, postId }) => {
  const userInfo = useNSUserInfo(authorId);
  const {
    media,
    isPlaying,
    handlePlayPause,
    loadAndPlaySound,
    lastTimePosition,
  } = useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.postId === postId,
    [media?.postId, postId]
  );
  const duration = useMemo(
    () => getAudioDuration(file.audioMetadata?.duration),
    [file]
  );

  const onPressPlayPause = async () => {
    if (isInMediaPlayer) {
      await handlePlayPause();
    } else {
      const songToPlay: Media = {
        imageUrl: userInfo.metadata.image || undefined,
        name: "Song from Social Feed",
        createdBy: authorId,
        fileUrl: file.url,
        duration: file.audioMetadata?.duration,
        // postId is used to difference audios from Social Feed (News feed  or Article consultation)
        postId: postId || Math.floor(Math.random() * 200000).toString(),
      };
      await loadAndPlaySound(songToPlay);
    }
  };

  const hasThumbnail = useMemo(
    () => typeof file?.thumbnailFileData?.url === "string",
    [file?.thumbnailFileData?.url]
  );

  const positionPercent = useMemo(
    () =>
      (isInMediaPlayer ? lastTimePosition : 0) /
      (file.audioMetadata?.duration || 1),
    [file.audioMetadata?.duration, lastTimePosition, isInMediaPlayer]
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
        height: 140,
      }}
    >
      <TouchableOpacity
        onPress={onPressPlayPause}
        activeOpacity={0.9}
        style={{
          backgroundColor:
            isInMediaPlayer && isPlaying ? secondaryColor : neutral00,
          height: 40,
          width: 40,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG
          source={isInMediaPlayer && isPlaying ? pauseSVG : playSVG}
          width={24}
          height={24}
          color={isInMediaPlayer && isPlaying ? neutral00 : secondaryColor}
        />
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
                {getAudioDuration(isInMediaPlayer ? lastTimePosition : 0)}
              </BrandText>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {duration}
              </BrandText>
            </View>
            <View
              style={{
                overflow: "hidden",
              }}
            >
              <AudioWaveform
                waveform={file.audioMetadata?.waveform || []}
                positionPercent={positionPercent}
                duration={file.audioMetadata?.duration || 1}
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
