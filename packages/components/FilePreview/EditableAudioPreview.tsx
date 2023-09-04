import React, { useEffect, useMemo, useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";

import { AudioWaveform } from "./AudioWaveform";
import { AUDIO_WAVEFORM_MAX_WIDTH } from "./AudioWaveform/AudioWaveform.web";
import { DeleteButton } from "./DeleteButton";
import pauseSVG from "../../../assets/icons/pause.svg";
import playSVG from "../../../assets/icons/play.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
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
import { Media } from "../../utils/types/mediaPlayer";
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
  const [thumbnailFile, setThumbnailFile] = useState<LocalFileData>();
  const {
    media,
    isPlaying,
    handlePlayPause,
    loadAndPlaySound,
    lastTimePosition,
    removeSound,
  } = useMediaPlayer();
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userInfo = useNSUserInfo(userId);
  const isInMediaPlayer = useMemo(
    () => media?.fileUrl === file.url,
    [media?.fileUrl, file.url]
  );

  const onPressPlayPause = async () => {
    if (isInMediaPlayer) {
      await handlePlayPause();
    } else {
      const songToAdd: Media = {
        imageUrl: userInfo.metadata.image || undefined,
        name: file.fileName,
        createdBy: userId,
        fileUrl: file.url,
        duration: file.audioMetadata?.duration,
      };
      await loadAndPlaySound(songToAdd);
    }
  };
  useEffect(() => {
    setThumbnailFile(file.thumbnailFileData);
  }, [file]);

  const positionPercent = useMemo(
    () =>
      (isInMediaPlayer ? lastTimePosition : 0) /
      (file.audioMetadata?.duration || 1),
    [file.audioMetadata?.duration, lastTimePosition, isInMediaPlayer]
  );

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
      <DeleteButton
        onPress={async () => {
          if (isInMediaPlayer) {
            await removeSound();
          }
          onDelete(file);
        }}
      />

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
          onPress={onPressPlayPause}
          activeOpacity={0.9}
          style={{
            backgroundColor:
              isInMediaPlayer && isPlaying ? secondaryColor : neutral00,
            height: 48,
            width: 48,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            marginLeft: layout.spacing_x1,
          }}
        >
          <SVG
            source={isInMediaPlayer && isPlaying ? pauseSVG : playSVG}
            width={24}
            height={24}
            color={isInMediaPlayer && isPlaying ? neutral00 : secondaryColor}
          />
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
              waveform={file.audioMetadata?.waveform || []}
              positionPercent={positionPercent}
              duration={file.audioMetadata?.duration || 1}
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
                  Thumbnail
                </BrandText>
              </>
            )}
          </TouchableOpacity>
        )}
      </FileUploader>
    </View>
  );
};
