import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
import { VideoFullscreenUpdate } from "expo-av/src/Video.types";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { TimerSlider } from "./TimerSlider";
import { VolumeSlider } from "./VolumeSlider";
import NextIcon from "../../../assets/icons/media-player/next.svg";
import PauseIcon from "../../../assets/icons/pause.svg";
import PlayIcon from "../../../assets/icons/play.svg";
import FullScreenIcon from "../../../assets/icons/video-player/full-screen.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";
import { Media } from "../../utils/types/mediaPlayer";
import { VideoMetaInfo } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../spacer";

interface MediaPlayerVideoProps {
  videoMetaInfo: VideoMetaInfo;
  videoId?: string;
  authorId: string;
  postId?: string;
  resizeMode?: ResizeMode;
  style?: StyleProp<ViewStyle>;
}

const CONTROLS_PADDING = layout.spacing_x2;
// expo-av Video component plugged to MediaPlayerContext
export const MediaPlayerVideo: FC<MediaPlayerVideoProps> = ({
  videoMetaInfo,
  videoId,
  authorId,
  postId,
  resizeMode,
  style,
}) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const [width, setWidth] = useState(0);
  const [localStatus, setLocalStatus] = useState<AVPlaybackStatusSuccess>();
  const { isDAO } = useIsDAO(authorId);
  const { setToastError } = useFeedbacks();
  const {
    media,
    onVideoStatusUpdate,
    playbackStatus,
    handlePlayPause,
    nextMedia,
    firstPlayVideo,
    triggerVideoFullscreen,
  } = useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.fileUrl === videoMetaInfo.url,
    [videoMetaInfo.url, media?.fileUrl]
  );
  const videoRef = useRef<Video>(null);
  const mediaToSet: Media = {
    imageUrl:
      videoMetaInfo.image ||
      userInfo.metadata.image ||
      nameServiceDefaultImage(isDAO, selectedNetwork),
    name: videoMetaInfo.title,
    createdBy: authorId,
    fileUrl: videoMetaInfo.url,
    duration: videoMetaInfo.duration,
    // postId is used to difference videos from Social Feed (News feed or Article consultation)
    postId: postId || Math.floor(Math.random() * 200000).toString(),
    videoId: videoId || "",
    isVideo: true,
  };
  const [extraPressCount, setExtraPressCount] = useState(0);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout>();
  const [fullScreenUpdate, setFullScreenUpdate] =
    useState<VideoFullscreenUpdate>();

  const onPressPlayPause = async () => {
    if (isInMediaPlayer || !videoRef.current) {
      await handlePlayPause();
    } else {
      await firstPlayVideo(videoRef.current, mediaToSet);
    }
  };

  // Handle play/pause and trigger fullscreen on double press
  const onPressVideoWrapper = () => {
    setExtraPressCount((backCount) => backCount + 1);
    if (extraPressCount === 1) {
      if (isInMediaPlayer) {
        triggerVideoFullscreen();
      } else {
        videoRef.current?._setFullscreen(true);
      }
      clearTimeout(pressTimer);
    } else {
      setPressTimer(
        setTimeout(() => {
          onPressPlayPause();
          setExtraPressCount(0);
        }, 500) // 500ms to consider it's a double press
      );
    }
  };

  const onLocalPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if ("uri" in status && status.isLoaded) {
      setLocalStatus(status);
      if (isInMediaPlayer) {
        await onVideoStatusUpdate(status);
      }
      // Sync with MediaProvider, if not synced, if the video is played for the first time, on fullscreen
      else if (
        fullScreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT &&
        status.isPlaying &&
        videoRef.current
      ) {
        await firstPlayVideo(videoRef.current, mediaToSet);
      }
    }
    if ("error" in status) {
      console.error("Error while playbackStatus update: ", status.error);
      setToastError({
        title: "Error while playbackStatus update",
        message: status.error || "",
      });
    }
  };

  return (
    <View
      style={{ width: "100%" }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/*---- expo-av Video */}
      <CustomPressable onPress={onPressVideoWrapper}>
        <Video
          ref={videoRef}
          status={isInMediaPlayer ? playbackStatus : localStatus}
          onFullscreenUpdate={(e) => setFullScreenUpdate(e.fullscreenUpdate)}
          onPlaybackStatusUpdate={onLocalPlaybackStatusUpdate}
          useNativeControls={false}
          source={{
            uri: ipfsURLToHTTPURL(videoMetaInfo.url),
          }}
          style={style}
          resizeMode={resizeMode}
        />
      </CustomPressable>

      {/*TODO: Hide controls and shadow if pause and video not hovered*/}

      {/* Shadow */}
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0.5 }}
        colors={[
          "rgba(0,0,0,1)",
          "rgba(0,0,0,.8)",
          "rgba(0,0,0,.2)",
          "rgba(0,0,0,0)",
        ]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "20%",
          width: "100%",
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      />

      {/*---- Custom controls*/}
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          left: 0,
          bottom: 0,
          paddingHorizontal: CONTROLS_PADDING,
          width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CustomPressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={onPressPlayPause}
            >
              <SVG
                source={
                  (isInMediaPlayer && playbackStatus?.isPlaying) ||
                  (!isInMediaPlayer && localStatus?.isPlaying)
                    ? PauseIcon
                    : PlayIcon
                }
                height={24}
                width={24}
                color={secondaryColor}
              />
            </CustomPressable>

            <SpacerRow size={1.5} />
            <CustomPressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={nextMedia}
            >
              <SVG
                source={NextIcon}
                height={20}
                width={20}
                color={secondaryColor}
              />
            </CustomPressable>

            <SpacerRow size={0.5} />

            {/*FIXME: Volume badly sync*/}
            <VolumeSlider
              useAltStyle
              playbackStatus={isInMediaPlayer ? playbackStatus : localStatus}
            />
            <SpacerRow size={1.5} />

            {/* Display time */}
            <BrandText style={fontSemibold13}>
              {`${prettyMediaDuration(
                isInMediaPlayer
                  ? playbackStatus?.positionMillis
                  : localStatus?.positionMillis
              )} / ${prettyMediaDuration(
                isInMediaPlayer
                  ? playbackStatus?.durationMillis
                  : localStatus?.durationMillis
              )}`}
            </BrandText>
          </View>

          <CustomPressable
            onPress={() => {
              if (isInMediaPlayer) triggerVideoFullscreen();
              else videoRef.current?._setFullscreen(true);
            }}
          >
            <SVG
              source={FullScreenIcon}
              width={20}
              height={20}
              color={secondaryColor}
            />
          </CustomPressable>
        </View>

        <SpacerColumn size={1} />
        <TimerSlider
          width={width - CONTROLS_PADDING * 2}
          hideDuration
          playbackStatus={isInMediaPlayer ? playbackStatus : localStatus}
        />
        <SpacerColumn size={2.5} />
      </View>
    </View>
  );
};
