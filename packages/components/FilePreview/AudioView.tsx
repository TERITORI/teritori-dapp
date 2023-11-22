import React, { useMemo } from "react";
import { View, TouchableOpacity, ImageStyle } from "react-native";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import {
  errorColor,
  neutral00,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";
import { Media } from "../../utils/types/mediaPlayer";
import { BrandText } from "../BrandText";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";

const THUMBNAIL_SIZE = 140;

export const AudioView: React.FC<{
  fileUrl: string;
  imageURI?: string;
  duration: number;
  waveform: number[];
  authorId: string;
  postId: string;
  fallbackImageURI?: string;
}> = ({
  fileUrl,
  imageURI,
  duration,
  waveform,
  authorId,
  postId,
  fallbackImageURI: fallbackImageSource,
}) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const { isDAO } = useIsDAO(authorId);
  const { media, handlePlayPause, loadAndPlaySoundsQueue, playbackStatus } =
    useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.postId === postId,
    [media?.postId, postId],
  );

  const onPressPlayPause = async () => {
    if (isInMediaPlayer) {
      await handlePlayPause();
    } else {
      const songToPlay: Media = {
        imageUrl:
          imageURI ||
          userInfo.metadata.image ||
          nameServiceDefaultImage(isDAO, selectedNetwork),
        name: "Song from Social Feed",
        createdBy: authorId,
        fileUrl,
        duration,
        // postId is used to difference audios from Social Feed (News feed or Article consultation)
        postId: postId || Math.floor(Math.random() * 200000).toString(),
      };
      // TODO: Play songs of social feed: Add songs of next posts in queue
      await loadAndPlaySoundsQueue([songToPlay]);
    }
  };

  const positionPercent = useMemo(
    () =>
      (isInMediaPlayer && playbackStatus?.positionMillis
        ? playbackStatus.positionMillis
        : 0) / (duration || 1),
    [duration, playbackStatus?.positionMillis, isInMediaPlayer],
  );

  if (!fileUrl)
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
            isInMediaPlayer && playbackStatus?.isPlaying
              ? secondaryColor
              : neutral00,
          height: 40,
          width: 40,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG
          source={
            isInMediaPlayer && playbackStatus?.isPlaying ? pauseSVG : playSVG
          }
          width={24}
          height={24}
          color={
            isInMediaPlayer && playbackStatus?.isPlaying
              ? neutral00
              : secondaryColor
          }
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
                {prettyMediaDuration(
                  isInMediaPlayer && playbackStatus?.positionMillis
                    ? playbackStatus.positionMillis
                    : 0,
                )}
              </BrandText>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {prettyMediaDuration(duration)}
              </BrandText>
            </View>
            <View
              style={{
                overflow: "hidden",
              }}
            >
              <AudioWaveform
                waveform={waveform}
                positionPercent={positionPercent}
                duration={duration || 1}
              />
            </View>
          </View>

          <OptimizedImage
            sourceURI={imageURI}
            fallbackURI={fallbackImageSource}
            resizeMode="cover"
            width={THUMBNAIL_SIZE}
            height={THUMBNAIL_SIZE}
            style={imageCStyle}
          />
        </View>
      </View>
    </View>
  );
};

const imageCStyle: ImageStyle = {
  height: THUMBNAIL_SIZE,
  width: THUMBNAIL_SIZE,
  marginLeft: layout.spacing_x1,
  borderRadius: 4,
};
