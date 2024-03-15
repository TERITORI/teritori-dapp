import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { TimerSlider } from "./TimerSlider";
import { VolumeSlider } from "./VolumeSlider";
import defaultThumbnailImage from "../../../assets/default-images/default-video-thumbnail.jpg";
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
import { web3ToWeb2URI } from "../../utils/ipfs";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";
import { SocialFeedVideoMetadata } from "../../utils/types/feed";
import { Media } from "../../utils/types/mediaPlayer";
import { BrandText } from "../BrandText";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SOCIAl_CARD_BORDER_RADIUS } from "../socialFeed/SocialCard/cards/SocialThreadCard";
import { SpacerColumn, SpacerRow } from "../spacer";

interface MediaPlayerVideoProps {
  videoMetadata: SocialFeedVideoMetadata;
  authorId: string;
  postId?: string;
  resizeMode?: ResizeMode;
  style?: StyleProp<ViewStyle>;
}

const CONTROLS_HEIGHT = 68;
const CONTROLS_PADDING_HORIZONTAL = layout.spacing_x2;

// expo-av Video component plugged to MediaPlayerContext
export const MediaPlayerVideo: FC<MediaPlayerVideoProps> = ({
  videoMetadata,
  authorId,
  postId,
  resizeMode,
  style,
}) => {
  const { media, onLayoutPlayerVideo } = useMediaPlayer();
  const { current: id } = useRef(uuidv4());
  const isInMediaPlayer = useMemo(() => media?.id === id, [id, media?.id]);

  const containerRef = useRef<View>(null);
  const videoRef = useRef<Video>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isControlsShown, setControlsShown] = useState(false);

  return (
    <View
      ref={containerRef}
      style={[{ width: "100%" }, style]}
      onLayout={(e) => {
        if (isInMediaPlayer && videoRef.current) {
          onLayoutPlayerVideo(videoRef.current);
        }
        setContainerWidth(e.nativeEvent.layout.width);
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <ExpoAvVideo
        videoRef={videoRef}
        containerRef={containerRef}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        isControlsShown={isControlsShown}
        isInMediaPlayer={isInMediaPlayer}
        videoMetadata={videoMetadata}
        authorId={authorId}
        postId={postId}
        resizeMode={resizeMode}
        id={id}
        setControlsShown={setControlsShown}
      />
    </View>
  );
};

type ExpoAvVideoType = {
  isInMediaPlayer: boolean;
  videoRef: RefObject<Video>;
  containerRef: RefObject<View>;
  containerWidth: number;
  containerHeight: number;
  isControlsShown: boolean;
  videoMetadata: SocialFeedVideoMetadata;
  postId?: string;
  resizeMode?: ResizeMode;
  authorId: string;
  id: string;
  setControlsShown: Dispatch<SetStateAction<boolean>>;
};

function ExpoAvVideo({
  isInMediaPlayer,
  videoRef,
  containerWidth,
  containerHeight,
  isControlsShown,
  videoMetadata,
  postId,
  resizeMode,
  authorId,
  id,
  containerRef,
  setControlsShown,
}: ExpoAvVideoType) {
  const {
    onVideoStatusUpdate,
    firstPlayVideo,
    triggerVideoFullscreen,
    handlePlayPause,
  } = useMediaPlayer();

  const { setToast } = useFeedbacks();
  const isMobile = useIsMobile();
  const [localStatus, setLocalStatus] = useState<AVPlaybackStatusSuccess>();
  const [extraPressCount, setExtraPressCount] = useState(0);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout>();
  const [isThumbnailShown, setThumbnailShown] = useState(true);
  // why?: Linked to problem code in onLocalPlaybackStatusUpdate()
  // const [fullScreenUpdate, setFullScreenUpdate] =
  //   useState<VideoFullscreenUpdate>();

  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const { isDAO } = useIsDAO(authorId);

  // Handle show/hide controls by hovering the video area with mouse
  const mousePosition = useMousePosition();
  containerRef.current?.measure((ox, oy, width, height, px, py) => {
    if (
      (mousePosition.x >= px &&
        mousePosition.x <= px + width &&
        mousePosition.y >= py &&
        mousePosition.y <= py + height &&
        !isMobile) ||
      !localStatus?.isPlaying
    ) {
      setControlsShown(true);
    } else {
      setControlsShown(false);
    }
  });

  const thumbnailURI =
    videoMetadata.videoFile.thumbnailFileData?.url ||
    userInfo.metadata.image ||
    nameServiceDefaultImage(isDAO, selectedNetwork);
  const fixedThumbnailURI = thumbnailURI
    ? thumbnailURI.includes("://")
      ? thumbnailURI
      : "ipfs://" + thumbnailURI // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  const mediaToSet: Media = {
    id,
    imageUrl: fixedThumbnailURI,
    name: videoMetadata.title,
    createdBy: authorId,
    fileUrl: videoMetadata.videoFile.url,
    duration: videoMetadata.videoFile.videoMetadata?.duration,
    // postId is used to difference videos from Social Feed (News feed or Article consultation)
    postId: postId || Math.floor(Math.random() * 200000).toString(),
    isVideo: true,
  };

  const onPressPlayPause = async () => {
    setThumbnailShown(false);
    if (isInMediaPlayer || !videoRef.current) {
      await handlePlayPause();
    } else {
      await firstPlayVideo(videoRef.current, mediaToSet);
    }
  };

  // Handle play/pause and trigger fullscreen on double press
  const onPressVideoWrapper = () => {
    setThumbnailShown(false);
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
        }, 500), // 500ms to consider it's a double press
      );
    }
  };

  const onLocalPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if ("uri" in status && status.isLoaded) {
      setLocalStatus(status);

      if (isInMediaPlayer && status.positionMillis > 0) {
        onVideoStatusUpdate(status);
      }
      // Fix me: This code is not working and stoping video to play
      // Sync with MediaProvider, if not synced, if the video is played for the first time, on fullscreen
      // else if (
      //   fullScreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT &&
      //   status.isPlaying &&
      //   videoRef.current
      // ) {
      //   await firstPlayVideo(videoRef.current, mediaToSet);
      // }
    }
    if ("error" in status) {
      console.error("Error while playbackStatus update: ", status.error);
      setToast({
        mode: "mini",
        type: "error",
        message: `Error while playbackStatus update : ${status.error}`,
      });
    }
  };

  return (
    <>
      <CustomPressable
        onPress={onPressVideoWrapper}
        style={{
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {fixedThumbnailURI && isThumbnailShown && (
          <OptimizedImage
            sourceURI={fixedThumbnailURI}
            width={containerWidth}
            height={containerHeight}
            style={{
              width: containerWidth,
              height: containerHeight,
              borderRadius: SOCIAl_CARD_BORDER_RADIUS,
              position: "absolute",
              zIndex: 1,
            }}
          />
        )}
        <Video
          ref={videoRef}
          onPlaybackStatusUpdate={onLocalPlaybackStatusUpdate}
          useNativeControls={false}
          // Why?: Linked to problem code in onLocalPlaybackStatusUpdate()
          // onFullscreenUpdate={(e) => setFullScreenUpdate(e.fullscreenUpdate)}
          source={{
            uri: web3ToWeb2URI(videoMetadata.videoFile.url),
          }}
          style={{ width: "100%", height: "100%" }}
          posterStyle={{ width: "100%", height: "100%" }}
          videoStyle={{
            width: "100%",
            height: "100%",
            borderRadius: SOCIAl_CARD_BORDER_RADIUS,
          }}
          resizeMode={resizeMode}
        />
      </CustomPressable>

      {isControlsShown && (
        <MediaPlayerController
          containerWidth={containerWidth}
          playbackStatus={localStatus}
          isInMediaPlayer={isInMediaPlayer}
          videoRef={videoRef}
          onPressPlayPause={onPressPlayPause}
        />
      )}
    </>
  );
}

type TypeMediaPlayerController = {
  containerWidth: number;
  playbackStatus?: AVPlaybackStatusSuccess;
  isInMediaPlayer: boolean;
  videoRef: RefObject<Video>;
  onPressPlayPause: () => void;
};

function MediaPlayerController({
  containerWidth,
  playbackStatus,
  isInMediaPlayer,
  videoRef,
  onPressPlayPause,
}: TypeMediaPlayerController) {
  const { nextMedia, triggerVideoFullscreen } = useMediaPlayer();
  const isMobile = useIsMobile();
  return (
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
          zIndex: 2,
        }}
      />

      {/*---- Custom controls*/}
      <View
        style={{
          zIndex: 3,
          position: "absolute",
          left: 0,
          bottom: 0,
          paddingHorizontal: CONTROLS_PADDING_HORIZONTAL,
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
              onPress={() => onPressPlayPause()}
            >
              <SVG
                source={playbackStatus?.isPlaying ? PauseIcon : PlayIcon}
                height={24}
                width={24}
                color={secondaryColor}
              />
            </CustomPressable>

            <SpacerRow size={1.5} />
            {/*TODO: handle Next for Videos */}
            <CustomPressable
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={() => nextMedia()}
              disabled
            >
              <SVG source={NextIcon} height={20} width={20} color={neutralA3} />
            </CustomPressable>
            <SpacerRow size={isMobile ? 1.5 : 0.5} />

            {!isMobile && (
              <>
                <VolumeSlider useAltStyle playbackStatus={playbackStatus} />
                <SpacerRow size={1.5} />
              </>
            )}

            {/* Display time */}
            <BrandText style={fontSemibold13}>
              {`${prettyMediaDuration(
                playbackStatus?.positionMillis,
              )} / ${prettyMediaDuration(playbackStatus?.durationMillis)}`}
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
          width={containerWidth - CONTROLS_PADDING_HORIZONTAL * 2}
          hideDuration
          playbackStatus={playbackStatus}
        />
        <SpacerColumn size={2.5} />
      </View>
    </>
  );
}
