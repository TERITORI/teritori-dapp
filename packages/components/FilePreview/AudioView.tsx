import React, { useMemo } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { getMediaDuration } from "../../utils/mediaPlayer";
import {
  errorColor,
  neutral00,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";
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
  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const {
    media,
    isPlaying,
    handlePlayPause,
    loadAndPlaySoundsQueue,
    playbackStatus,
  } = useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.postId === postId,
    [media?.postId, postId]
  );
  const duration = useMemo(
    () => getMediaDuration(file.audioMetadata?.duration),
    [file]
  );

  const onPressPlayPause = async () => {
    if (isInMediaPlayer) {
      await handlePlayPause();
    } else {
      const songToPlay: Media = {
        imageUrl:
          file?.thumbnailFileData?.url ||
          userInfo.metadata.image ||
          nameServiceDefaultImage(selectedNetwork),
        name: "Song from Social Feed",
        createdBy: authorId,
        fileUrl: file.url,
        duration: file.audioMetadata?.duration,
        // postId is used to difference audios from Social Feed (News feed or Article consultation)
        postId: postId || Math.floor(Math.random() * 200000).toString(),
      };
      // TODO: Play songs of social feed: Add songs of next posts in queue
      await loadAndPlaySoundsQueue([songToPlay]);
    }
  };

  const hasThumbnail = useMemo(
    () => typeof file?.thumbnailFileData?.url === "string",
    [file?.thumbnailFileData?.url]
  );

  const positionPercent = useMemo(
    () =>
      (isInMediaPlayer && playbackStatus?.positionMillis
        ? playbackStatus.positionMillis
        : 0) / (file.audioMetadata?.duration || 1),
    [
      file.audioMetadata?.duration,
      playbackStatus?.positionMillis,
      isInMediaPlayer,
    ]
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
                {getMediaDuration(
                  isInMediaPlayer && playbackStatus?.positionMillis
                    ? playbackStatus.positionMillis
                    : 0
                )}
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
