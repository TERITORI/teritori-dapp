import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { MediaNameImage } from "./MediaNameImage";
import { TimerSlider } from "./TimerSlider";
import { VolumeSlider } from "./VolumeSlider";
import ImageTest from "../../../assets/default-images/guardian_1.png";
import AddIcon from "../../../assets/icons/media-player/add.svg";
import LoopIcon from "../../../assets/icons/media-player/loop.svg";
import NextIcon from "../../../assets/icons/media-player/next.svg";
import PauseIcon from "../../../assets/icons/media-player/pause.svg";
import PlayIcon from "../../../assets/icons/media-player/play.svg";
import PreviousIcon from "../../../assets/icons/media-player/previous.svg";
import RandomIcon from "../../../assets/icons/media-player/random.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { nextItemInArray, previousItemInArray } from "../../utils/arrays";
import { AUDIO_MIME_TYPES } from "../../utils/mime";
import {
  neutral17,
  neutral22,
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { SVG } from "../SVG";
import { Separator } from "../Separator";
import { CustomPressable } from "../buttons/CustomPressable";
import { FileUploader } from "../fileUploader";
import { SpacerRow } from "../spacer";

export const MediaPlayerBar: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const {
    loadAudio,
    isPlaying,
    handlePlayPause,
    media,
    isLoop,
    isRandom,
    setIsLoop,
    setIsRandom,
    didJustFinish,
    isMediaPlayerOpen,
    queue,
    loadAndPlayQueue,
  } = useMediaPlayer();

  const onUpload = async (files: LocalFileData[]) => {
    await loadAudio({
      name: files[0]?.fileName,
      imageUrl: ImageTest,
      createdBy: "@todo",
      fileUrl: files[0]?.url || "",
      duration: files[0]?.audioMetadata?.duration || 0,
    });
  };

  const onPressPrevious = async () => {
    if (!media) return;
    const currentIndex = queue.indexOf(media);
    await loadAndPlayQueue(queue, nextItemInArray(queue, currentIndex));
  };
  const onPressNext = async () => {
    if (!media) return;
    const currentIndex = queue.indexOf(media);
    await loadAndPlayQueue(queue, previousItemInArray(queue, currentIndex));
  };

  if (!isMediaPlayerOpen) return null;
  return (
    <>
      <FileUploader
        onUpload={onUpload}
        mimeTypes={AUDIO_MIME_TYPES}
        style={{ position: "absolute" }}
      />
      <View style={[styles.container, style]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CustomPressable onPress={() => setIsRandom((isRandom) => !isRandom)}>
            <SVG
              source={RandomIcon}
              height={20}
              width={20}
              color={isRandom ? secondaryColor : neutralA3}
            />
          </CustomPressable>
          <SpacerRow size={2.5} />

          <CustomPressable
            onPress={onPressPrevious}
            disabled={queue.length <= 2 || !media}
          >
            <SVG
              source={PreviousIcon}
              height={20}
              width={20}
              color={queue.length <= 2 ? neutralA3 : secondaryColor}
            />
          </CustomPressable>
          <SpacerRow size={2.5} />

          <CustomPressable onPress={handlePlayPause} disabled={!media}>
            <SVG
              source={isPlaying && !didJustFinish ? PauseIcon : PlayIcon}
              height={28}
              width={28}
              color={media ? secondaryColor : neutralA3}
            />
          </CustomPressable>
          <SpacerRow size={2.5} />

          <CustomPressable
            onPress={onPressNext}
            disabled={queue.length <= 2 || !media}
          >
            <SVG
              source={NextIcon}
              height={20}
              width={20}
              color={queue.length <= 2 ? neutralA3 : secondaryColor}
            />
          </CustomPressable>
          <SpacerRow size={2.5} />

          <CustomPressable onPress={() => setIsLoop((isLoop) => !isLoop)}>
            <SVG
              source={LoopIcon}
              height={20}
              width={20}
              color={isLoop ? secondaryColor : neutralA3}
            />
          </CustomPressable>
          <SpacerRow size={4} />

          <Separator color={neutral33} style={{ height: 16 }} horizontal />
          <SpacerRow size={4} />

          {/*TODO: white ? Handle this button*/}
          <CustomPressable disabled>
            <SVG source={AddIcon} height={20} width={20} />
          </CustomPressable>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TimerSlider />
          <SpacerRow size={4} />
          <MediaNameImage />
        </View>
        <VolumeSlider />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x3,
    height: 48,
    backgroundColor: neutral17,
    borderTopWidth: 1,
    borderTopColor: neutral22,
  },
});
