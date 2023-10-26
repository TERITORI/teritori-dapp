import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { TimerSlider } from "./TimerSlider";
import { VolumeSlider } from "./VolumeSlider";
import NextIcon from "../../../assets/icons/media-player/next.svg";
import PauseIcon from "../../../assets/icons/pause.svg";
import PlayIcon from "../../../assets/icons/play.svg";
import FullScreenIcon from "../../../assets/icons/video-player/full-screen.svg";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { neutral00, secondaryColor } from "../../utils/style/colors";
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

const TIMER_PADDING_HORIZONTAL = layout.spacing_x1;
const CONTROLS_BOTTOM = layout.spacing_x1;
const CONTROLS_CONTAINER_HEIGHT = 44;

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
  const { isDAO } = useIsDAO(authorId);
  const {
    media,
    onVideoStatusUpdate,
    isPlaying,
    playbackStatus,
    handlePlayPause,
    nextMedia,
    firstPlayVideo,
  } = useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.fileUrl === videoMetaInfo.url,
    [videoMetaInfo.url, media?.fileUrl]
  );
  const newVideoRef = useRef<Video>(null);
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
  };

  const onPressPlayPause = async () => {
    if (isInMediaPlayer || !newVideoRef.current) {
      await handlePlayPause();
    } else {
      await firstPlayVideo(newVideoRef.current, mediaToSet);
    }
  };

  const onPressFullScreen = () => {
    if (!newVideoRef.current) return;
    newVideoRef.current._setFullscreen(true);
  };

  return (
    <View
      style={{ width: "100%" }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <CustomPressable onPress={onPressPlayPause}>
        {/*TODO: Sync time and volume (localStatus ?)*/}
        <Video
          ref={newVideoRef}
          status={isInMediaPlayer ? playbackStatus : undefined}
          onPlaybackStatusUpdate={(status) =>
            isInMediaPlayer ? onVideoStatusUpdate(status) : undefined
          }
          useNativeControls={false}
          source={{
            uri: ipfsURLToHTTPURL(videoMetaInfo.url),
          }}
          style={style}
          resizeMode={resizeMode}
          positionMillis={
            isInMediaPlayer ? playbackStatus?.positionMillis : undefined
          }
          // volume={isInMediaPlayer ? playbackStatus?.volume : .5}
        />
      </CustomPressable>
      {/*---- Custom controls*/}

      <View
        style={{
          zIndex: 1,
          position: "absolute",
          left: 0,
          bottom: CONTROLS_BOTTOM,
          paddingHorizontal: TIMER_PADDING_HORIZONTAL,
          width,
          height: CONTROLS_CONTAINER_HEIGHT,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 32,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", height: 32 }}
          >
            <CustomPressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={onPressPlayPause}
            >
              <SVG
                source={
                  isPlaying && !playbackStatus?.didJustFinish
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
            <VolumeSlider useAltStyle />
            {isInMediaPlayer && (
              <>
                <SpacerRow size={1.5} />
                <BrandText style={fontSemibold13}>
                  {`${prettyMediaDuration(
                    playbackStatus?.positionMillis
                  )} / ${prettyMediaDuration(playbackStatus?.durationMillis)}`}
                </BrandText>
              </>
            )}
          </View>

          <CustomPressable
            style={{
              backgroundColor: neutral00,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32,
            }}
            onPress={onPressFullScreen}
          >
            <SVG
              source={FullScreenIcon}
              width={14}
              height={14}
              color={secondaryColor}
            />
          </CustomPressable>
        </View>

        <SpacerColumn size={1} />
        <TimerSlider
          width={width - TIMER_PADDING_HORIZONTAL * 2}
          hideDuration
        />
      </View>

      {/* Shadow at the bottom */}
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["rgba(0,0,0,.6)", "rgba(0,0,0,.3)", "rgba(0,0,0,.05)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: CONTROLS_CONTAINER_HEIGHT + CONTROLS_BOTTOM,
          width: "100%",
        }}
      />
    </View>
  );
};
