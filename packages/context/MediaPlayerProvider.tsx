import { Route } from "@react-navigation/native";
import {
  Audio,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  Video,
} from "expo-av";
import { shuffle } from "lodash";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useFeedbacks } from "./FeedbacksProvider";
import { useSelectedNetworkId } from "../hooks/useSelectedNetwork";
import { getNetworkObjectId } from "../networks";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { useAppNavigation } from "../utils/navigation";
import { Media } from "../utils/types/mediaPlayer";

interface DefaultValue {
  handlePlayPause: () => Promise<void>;
  media?: Media;
  isRandom: boolean;
  setIsRandom: Dispatch<SetStateAction<boolean>>;
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  loadAndPlaySoundsQueue: (
    queue: Media[],
    mediaToStart?: Media
  ) => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
  onChangeTimerPosition: (value: number) => void;
  onChangeVolume: (value: number) => void;
  onToggleLoop: () => void;
  playbackStatus?: AVPlaybackStatusSuccess;
  onVideoStatusUpdate: (status: AVPlaybackStatusSuccess) => Promise<void>;
  firstPlayVideo: (video: Video, media: Media) => void;
  triggerVideoFullscreen: () => void;
}

const defaultValue: DefaultValue = {
  handlePlayPause: async () => {},
  media: undefined,
  isRandom: false,
  setIsRandom: () => {},
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  loadAndPlaySoundsQueue: async () => {},
  canNext: false,
  canPrev: false,
  nextMedia: async () => {},
  prevMedia: async () => {},
  onChangeTimerPosition: () => {},
  onChangeVolume: () => {},
  onToggleLoop: () => {},
  playbackStatus: undefined,
  onVideoStatusUpdate: async () => {},
  firstPlayVideo: () => {},
  triggerVideoFullscreen: () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC = ({ children }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const [videoLastRoute, setVideoLastRoute] = useState<Route<any>>();
  // ------- Only used in UI
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(
    defaultValue.isMediaPlayerOpen
  );
  const [queue, setQueue] = useState<Media[]>([]);
  const [randomQueue, setRandomQueue] = useState<Media[]>([]);

  const [media, setMedia] = useState(defaultValue.media);
  // ------
  const { setToastError } = useFeedbacks();
  const [isRandom, setIsRandom] = useState(defaultValue.isRandom);
  const [av, setAv] = useState<Video | Audio.Sound>();
  const [playbackStatus, setPlaybackStatus] =
    useState<AVPlaybackStatusSuccess>();

  const loadAndPlaySound = useCallback(
    async (media: Media, queue: Media[], isRandom?: boolean) => {
      if (!queue || !media) return;
      // ------- Randomizing queue
      if (isRandom) {
        const randomQueue = [
          media,
          ...shuffle(queue).filter((m) => m.fileUrl !== media.fileUrl),
        ];
        setRandomQueue(randomQueue);
        queue = randomQueue;
        media = randomQueue[0];
      }
      setMedia(media);
      try {
        const { sound: createdSound } = await Audio.Sound.createAsync(
          { uri: ipfsURLToHTTPURL(media.fileUrl) },
          undefined,
          async (status: AVPlaybackStatus) => {
            if ("uri" in status && status.isLoaded) {
              setPlaybackStatus(status);

              if (status.didJustFinish && !status?.isLooping) {
                // ------- Autoplay queue
                const queueCurrentIndex = queue.indexOf(media);
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

  const firstPlayVideo = async (video: Video, media: Media) => {
    console.log(
      "navigation.getState()navigation.getState()",
      navigation.getState()
    );
    setVideoLastRoute(
      navigation.getState().routes[navigation.getState().routes.length - 1]
    );
    setMedia(media);
    await av?.pauseAsync();
    await av?.unloadAsync();
    setAv(video);
    await video.playAsync();
    setIsMediaPlayerOpen(true);
  };

  const onVideoStatusUpdate = async (status: AVPlaybackStatusSuccess) => {
    setPlaybackStatus(status);
  };

  // ============== Only used in UI
  const loadAndPlaySoundsQueue = async (
    queue: Media[],
    mediaToStart?: Media
  ) => {
    setQueue(queue);
    const randomMedia = queue[Math.floor(Math.random() * queue.length)];
    await loadAndPlaySound(
      mediaToStart ? mediaToStart : isRandom ? randomMedia : queue[0],
      queue,
      isRandom
    );
  };

  const triggerVideoFullscreen = async () => {
    // Before set fullscreen, we redirect to the video's screen, if it changed. Using navigation.getState().routes
    // If not, av._setFullscreen(true) will set the current browser's page as fullscreen without the video :(
    if (
      videoLastRoute?.key !==
      navigation.getState().routes[navigation.getState().routes.length - 1].key
    ) {
      if (media?.videoId) {
        // TODO: Uncomment this after video stuff integration
        // navigation.navigate("VideoDetail", { id: media.videoId });
      } else if (media?.postId) {
        navigation.navigate("FeedPostView", {
          id: getNetworkObjectId(selectedNetworkId, media.postId),
        });
      }
    }
    if (av && "_setFullscreen" in av) {
      await av._setFullscreen(true);
    }
  };

  const handlePlayPause = async () => {
    if (!av || !playbackStatus?.isLoaded) {
      return;
    }
    if (playbackStatus.isPlaying) {
      await av.pauseAsync();
    } else {
      await av.playAsync();
    }
  };

  const queueToUse = useMemo(
    () => (isRandom && randomQueue.length ? randomQueue : queue),
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

  const onChangeTimerPosition = (value: number) => av?.setPositionAsync(value);

  const onChangeVolume = (value: number) =>
    av?.setVolumeAsync(isNaN(value) ? 0 : value); // value is NaN in local dev env sometimes

  const onToggleLoop = () => {
    av?.setIsLoopingAsync(!playbackStatus?.isLooping);
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        handlePlayPause,
        media,
        isRandom,
        setIsRandom,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        loadAndPlaySoundsQueue,
        canNext,
        canPrev,
        nextMedia,
        prevMedia,
        onChangeTimerPosition,
        onChangeVolume,
        onToggleLoop,
        playbackStatus,
        onVideoStatusUpdate,
        firstPlayVideo,
        triggerVideoFullscreen,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
