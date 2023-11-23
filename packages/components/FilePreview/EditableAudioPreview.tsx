import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useState } from "react";
import { Image, View, TouchableOpacity, ActivityIndicator } from "react-native";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import { DeleteButton } from "./DeleteButton";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import {
  neutral00,
  neutral44,
  neutral33,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium32, fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { FileUploader } from "../fileUploader";

interface AudioPreviewProps {
  file: LocalFileData;
  onDelete: (file: LocalFileData) => void;
  onUploadThumbnail: (updatedFile: LocalFileData) => void;
}

export const EditableAudioPreview: React.FC<AudioPreviewProps> = ({
  file,
  onDelete,
  onUploadThumbnail,
}) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus>();
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();

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
        { uri: file.url },
        { progressUpdateIntervalMillis: 400 },
        (status) => setPlaybackStatus(status),
      );
      setSound(sound);
      setThumbnailFile(file.thumbnailFileData);
    };
    loadSound();
  }, [file]);

  const handlePlayPause = async () => {
    if (playbackStatus?.isLoaded && playbackStatus?.isPlaying) {
      await sound?.pauseAsync();
    } else {
      await sound?.playAsync();
    }
  };

  const positionPercent =
    ((playbackStatus?.isLoaded && playbackStatus?.positionMillis) || 0) /
    ((playbackStatus?.isLoaded && playbackStatus?.durationMillis) || 1);

  return (
    <View
      style={{
        height: 80,
        width: "100%",
        backgroundColor: neutral33,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <DeleteButton onPress={() => onDelete(file)} />

      <View
        style={{
          paddingVertical: layout.spacing_x0_75,
          paddingHorizontal: layout.spacing_x1,
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
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
            height: 48,
            width: 48,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            marginLeft: layout.spacing_x1,
          }}
        >
          {playbackStatus?.isLoaded && playbackStatus?.isBuffering ? (
            <ActivityIndicator size={12} color={secondaryColor} />
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
        {!!file.audioMetadata && (
          <View
            style={{
              marginHorizontal: layout.spacing_x2,
              maxWidth: AUDIO_WAVEFORM_MAX_WIDTH,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <AudioWaveform
              waveform={file.audioMetadata?.waveform}
              positionPercent={positionPercent}
              duration={
                playbackStatus?.isLoaded
                  ? playbackStatus?.durationMillis || 0
                  : 1
              }
            />
          </View>
        )}
      </View>

      <FileUploader
        onUpload={(files) => {
          onUploadThumbnail({ ...file, thumbnailFileData: files[0] });
          setThumbnailFile(files[0]);
        }}
        mimeTypes={IMAGE_MIME_TYPES}
      >
        {({ onPress }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              height: "100%",
              width: 80,
              backgroundColor: neutral44,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={onPress}
          >
            {thumbnailFile?.url ? (
              <Image
                source={{ uri: thumbnailFile.url }}
                style={{
                  height: 80,
                  width: 80,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
                resizeMode="cover"
              />
            ) : (
              <>
                <BrandText style={[fontMedium32]}>+</BrandText>
                <BrandText style={[fontSemibold12, { textAlign: "center" }]}>
                  Image
                </BrandText>
              </>
            )}
          </TouchableOpacity>
        )}
      </FileUploader>
    </View>
  );
};
