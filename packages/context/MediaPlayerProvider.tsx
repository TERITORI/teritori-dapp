import {
  Audio,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
import { shuffle } from "lodash";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
  FC,
  useEffect,
  useRef,
} from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useFeedbacks } from "./FeedbacksProvider";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { nameServiceDefaultImage } from "../utils/tns";
import { Media } from "../utils/types/mediaPlayer";

interface MediaPlayerVideoProps {
  videoUrl: string;
  authorId: string;
  postId?: string;
  resizeMode?: ResizeMode;
  style?: StyleProp<ViewStyle>;
  thumbnailUrl?: string;
}

interface DefaultValue {
  handlePlayPause: () => Promise<void>;
  isPlaying: boolean;
  media?: Media;
  isRandom: boolean;
  setIsRandom: Dispatch<SetStateAction<boolean>>;
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  loadAndPlaySoundsQueue: (
    queue: Media[],
    mediaToStart?: Media
  ) => Promise<void>;
  loadAndPlayVideo: (media: Media, video: Video) => Promise<void>;
  removeAv: () => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
  onChangeTimerPosition: (value: number) => void;
  onChangeVolume: (value: number) => void;
  onToggleLoop: () => void;
  playbackStatus?: AVPlaybackStatusSuccess;
  onPlayedVideoStatusUpdate: (status: AVPlaybackStatusSuccess) => void;
}

const defaultValue: DefaultValue = {
  handlePlayPause: async () => {},
  isPlaying: false,
  media: undefined,
  isRandom: false,
  setIsRandom: () => {},
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  loadAndPlaySoundsQueue: async () => {},
  loadAndPlayVideo: async () => {},
  removeAv: async () => {},
  canNext: false,
  canPrev: false,
  nextMedia: async () => {},
  prevMedia: async () => {},
  onChangeTimerPosition: () => {},
  onChangeVolume: () => {},
  onToggleLoop: () => {},
  playbackStatus: undefined,
  onPlayedVideoStatusUpdate: () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC = ({ children }) => {
  // ------- Only used in UI
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(
    defaultValue.isMediaPlayerOpen
  );
  const [queue, setQueue] = useState<Media[]>([]);
  const [randomQueue, setRandomQueue] = useState<Media[]>([]);
  const [isPlaying, setIsPlaying] = useState(defaultValue.isPlaying);
  const [media, setMedia] = useState(defaultValue.media);
  // ------
  const { setToastError } = useFeedbacks();
  const [isRandom, setIsRandom] = useState(defaultValue.isRandom);
  const [av, setAv] = useState<Video | Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] =
    useState<AVPlaybackStatusSuccess>();

  const loadAndPlaySound = useCallback(
    async (media: Media, queue?: Media[]) => {
      setMedia(media);
      try {
        const { sound: createdSound } = await Audio.Sound.createAsync(
          { uri: ipfsURLToHTTPURL(media.fileUrl) },
          undefined,
          async (status: AVPlaybackStatus) => {
            if ("uri" in status && status.isLoaded) {
              setPlaybackStatus(status);

              if (status.didJustFinish && !status?.isLooping) {
                setIsPlaying(false);
                // ------- Autoplay queue
                if (!queue) return;
                const queueCurrentIndex = media ? queue.indexOf(media) : -1;
                if (
                  queueCurrentIndex === -1 ||
                  queue.length < 2 ||
                  queueCurrentIndex === queue.length - 1
                ) {
                  return;
                }
                await loadAndPlaySound(queue[queueCurrentIndex + 1], queue);
                // -------
              }
            }
            if ("error" in status) {
              console.error(
                "Error while playbackStatus update: ",
                status.error
              );
              setToastError({
                title: "Error while playbackStatus update",
                message: status.error || "",
              });
            }
          }
        );
        setAv(createdSound);
        // ------- Autoplay createdSound
        await av?.unloadAsync();
        await createdSound?.playAsync();
        setIsPlaying(true);
        setIsMediaPlayerOpen(true);
        // -------
      } catch (e) {
        setToastError({
          title: "Error loading sound",
          message: e.message,
        });
      }
    },
    [setToastError, av]
  );

  const loadAndPlayVideo = async (media: Media, video: Video) => {
    setMedia(media);
    setAv(video);
    await av?.unloadAsync();
    setIsPlaying(true);
    setIsMediaPlayerOpen(true);
  };

  const onPlayedVideoStatusUpdate = (status: AVPlaybackStatusSuccess) => {
    setPlaybackStatus(status);
    if (status.didJustFinish && !status.isLooping) {
      setIsPlaying(false);
    }
    setIsPlaying(status.isPlaying);
  };

  // ------- Only used in UI
  const handlePlayPause = async () => {
    if (!av || !playbackStatus?.isLoaded) {
      return;
    }
    if (playbackStatus.isPlaying) {
      await av.pauseAsync();
      setIsPlaying(false);
    } else {
      await av.playAsync();
      setIsPlaying(true);
    }
  };

  const loadAndPlaySoundsQueue = async (
    queue: Media[],
    mediaToStart?: Media
  ) => {
    setQueue(queue);
    const randomQueue = shuffle(queue);
    setRandomQueue(randomQueue);

    if (isRandom) {
      await loadAndPlaySound(randomQueue[0], randomQueue);
    } else {
      await loadAndPlaySound(mediaToStart || queue[0], queue);
    }
  };

  const queueToUse = useMemo(
    () => (isRandom ? randomQueue : queue),
    [isRandom, randomQueue, queue]
  );

  const queueCurrentIndex = media ? queueToUse.indexOf(media) : -1;

  const canNext = useMemo(() => {
    if (queueCurrentIndex === -1 || queueToUse.length < 2) return false;
    return queueCurrentIndex !== queueToUse.length - 1;
  }, [queueToUse, queueCurrentIndex]);

  const canPrev = useMemo(() => {
    if (queueCurrentIndex === -1 || queueToUse.length < 2) return false;
    return queueCurrentIndex !== 0;
  }, [queueToUse, queueCurrentIndex]);

  const nextMedia = async () => {
    if (!canNext || queueCurrentIndex === -1) return;
    await loadAndPlaySound(queueToUse[queueCurrentIndex + 1], queueToUse);
  };
  const prevMedia = async () => {
    if (!canPrev || queueCurrentIndex === -1) return;
    await loadAndPlaySound(queueToUse[queueCurrentIndex - 1], queueToUse);
  };

  // Force reset MediaPlayer
  const removeAv = async () => {
    if (!av) return;
    setIsPlaying(false);
    setMedia(undefined);
    await av.unloadAsync();
  };

  const onChangeTimerPosition = (value: number) =>
    av?.setPositionAsync(value);

  const onChangeVolume = async (value: number) =>
    av?.setVolumeAsync(isNaN(value) ? 0 : value); // value is NaN in local dev env sometimes

  const onToggleLoop = () => {
    av?.setIsLoopingAsync(!playbackStatus?.isLooping);
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        handlePlayPause,
        isPlaying,
        media,
        isRandom,
        setIsRandom,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        loadAndPlaySoundsQueue,
        loadAndPlayVideo,
        removeAv,
        canNext,
        canPrev,
        nextMedia,
        prevMedia,
        onChangeTimerPosition,
        onChangeVolume,
        onToggleLoop,
        playbackStatus,
        onPlayedVideoStatusUpdate,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);

// expo-av Video component plugged to MediaPlayerContext
export const MediaPlayerVideo: FC<MediaPlayerVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  authorId,
  postId,
  resizeMode,
  style,
}) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const userInfo = useNSUserInfo(authorId);
  const videoRef = useRef<Video>(null);
  const [localPlaybackStatus, setLocalPlaybackStatus] =
    useState<AVPlaybackStatus>();
  const { media, loadAndPlayVideo, onPlayedVideoStatusUpdate } =
    useMediaPlayer();
  const isInMediaPlayer = useMemo(
    () => media?.postId === postId,
    [postId, media?.postId]
  );

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    setLocalPlaybackStatus(status);
    // First play: Store video in MediaPlayerContext
    if (
      status &&
      videoRef.current &&
      !isInMediaPlayer &&
      "uri" in status &&
      status.isLoaded &&
      status.isPlaying
    ) {
      const videoToPlay: Media = {
        imageUrl:
          thumbnailUrl ||
          userInfo.metadata.image ||
          nameServiceDefaultImage(selectedNetwork),
        name: "Video from Social Feed",
        createdBy: authorId,
        fileUrl: videoUrl,
        duration: status?.durationMillis,
        // postId is used to difference videos from Social Feed (News feed or Article consultation)
        postId: postId || Math.floor(Math.random() * 200000).toString(),
      };
      await loadAndPlayVideo(videoToPlay, videoRef.current);
    }
  };

  useEffect(() => {
    if (!localPlaybackStatus) return;
    // After setting video in MediaPlayerContext: Sync localPlaybackStatus in MediaPlayerContext
    if (
      isInMediaPlayer &&
      "uri" in localPlaybackStatus &&
      localPlaybackStatus.isLoaded
    ) {
      onPlayedVideoStatusUpdate(localPlaybackStatus);
    }
  }, [isInMediaPlayer, localPlaybackStatus, onPlayedVideoStatusUpdate]);

  return (
    <Video
      ref={videoRef}
      onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      useNativeControls
      source={{
        uri: ipfsURLToHTTPURL(videoUrl),
      }}
      style={style}
      resizeMode={resizeMode}
    />
  );
};
