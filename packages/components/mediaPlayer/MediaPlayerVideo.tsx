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
import FullScreenIcon from "../../../assets/icons/media-player/full-screen.svg";
import NextIcon from "../../../assets/icons/media-player/next.svg";
import PauseIcon from "../../../assets/icons/pause.svg";
import PlayIcon from "../../../assets/icons/play.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMousePosition } from "../../hooks/useMousePosition";
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

const CONTROLS_HEIGHT = 68;
// expo-av Video component plugged to MediaPlayerContext
export const MediaPlayerVideo: FC<MediaPlayerVideoProps> = ({
  videoMetaInfo,
  videoId,
  authorId,
  postId,
  resizeMode,
  style,
}) => {
  const { setToastError } = useFeedbacks();
  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const { isDAO } = useIsDAO(authorId);
  const isMobile = useIsMobile();
  const controlsPaddingHorizontal = isMobile
    ? layout.spacing_x1
    : layout.spacing_x2;
  const {
    media,
    onVideoStatusUpdate,
    playbackStatus,
    handlePlayPause,
    nextMedia,
    firstPlayVideo,
    triggerVideoFullscreen,
  } = useMediaPlayer();
  const [localStatus, setLocalStatus] = useState<AVPlaybackStatusSuccess>();
  const isInMediaPlayer = useMemo(
    () => media?.fileUrl === videoMetaInfo.url,
    [videoMetaInfo.url, media?.fileUrl]
  );
  // Plug or not the playbackStatus from MediaPLayerProvider
  const statusToUse = useMemo(
    () => (isInMediaPlayer ? playbackStatus : localStatus),
    [isInMediaPlayer, playbackStatus, localStatus]
  );
  const containerRef = useRef<View>(null);
  const videoRef = useRef<Video>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [extraPressCount, setExtraPressCount] = useState(0);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout>();
  const [fullScreenUpdate, setFullScreenUpdate] =
    useState<VideoFullscreenUpdate>();
  const [isControlsShown, setControlsShown] = useState(false);

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

  // Handle show/hide controls by hovering the video area with mouse
  const mousePosition = useMousePosition();
  containerRef.current?.measure((ox, oy, width, height, px, py) => {
    if (
      (mousePosition.x >= px &&
        mousePosition.x <= px + width &&
        mousePosition.y >= py &&
        mousePosition.y <= py + height &&
        !isMobile) ||
      !statusToUse?.isPlaying
    ) {
      setControlsShown(true);
    } else {
      setControlsShown(false);
    }
  });

  return (
    <View
      ref={containerRef}
      style={{ width: "100%" }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/*---- expo-av Video */}
      <CustomPressable
        onPress={onPressVideoWrapper}
        style={{
          zIndex: 0,
        }}
      >
        <Video
          ref={videoRef}
          status={statusToUse}
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

      {isControlsShown && (
        <>
          {/* Shadow */}
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.5 }}
            colors={[
              "rgba(0,0,0,1)",
              "rgba(0,0,0,.9)",
              "rgba(0,0,0,.3)",
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
              zIndex: 1,
            }}
          />

          {/*---- Custom controls*/}
          <View
            style={{
              zIndex: 2,
              position: "absolute",
              left: 0,
              bottom: 0,
              paddingHorizontal: controlsPaddingHorizontal,
              width: containerWidth,
              height: CONTROLS_HEIGHT,
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
                    source={statusToUse?.isPlaying ? PauseIcon : PlayIcon}
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
                <SpacerRow size={isMobile ? 1.5 : 0.5} />

                {!isMobile && (
                  <>
                    <VolumeSlider useAltStyle playbackStatus={statusToUse} />
                    <SpacerRow size={1.5} />
                  </>
                )}

                {/* Display time */}
                <BrandText style={fontSemibold13}>
                  {`${prettyMediaDuration(
                    statusToUse?.positionMillis
                  )} / ${prettyMediaDuration(statusToUse?.durationMillis)}`}
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
              width={containerWidth - controlsPaddingHorizontal * 2}
              hideDuration
              playbackStatus={statusToUse}
            />
            <SpacerColumn size={2.5} />
          </View>
        </>
      )}
    </View>
  );
};
