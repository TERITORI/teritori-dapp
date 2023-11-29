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
  ReactNode,
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
    mediaToStart?: Media,
  ) => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
  onChangeTimerPosition: (value: number) => void;
  onChangeVolume: (value: number) => void;
  onToggleLoop: () => void;
  playbackStatus?: AVPlaybackStatusSuccess;
  onVideoStatusUpdate: (status: AVPlaybackStatusSuccess) => void;
  firstPlayVideo: (video: Video, media: Media) => void;
  triggerVideoFullscreen: () => void;
  onLayoutPlayerVideo: (video: Video) => Promise<void>;
  resetMediaPlayer: () => void;
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
  onVideoStatusUpdate: () => {},
  firstPlayVideo: () => {},
  triggerVideoFullscreen: () => {},
  onLayoutPlayerVideo: async () => {},
  resetMediaPlayer: () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const [videoLastRoute, setVideoLastRoute] = useState<Route<any>>();
  // ------- Only used in UI
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(
    defaultValue.isMediaPlayerOpen,
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
    async (mediaToSet: Media, queue: Media[], isRandom?: boolean) => {
      if (!queue || !mediaToSet) return;
      // ------- Randomizing queue
      if (isRandom) {
        const randomQueue = [
          mediaToSet,
          ...shuffle(queue).filter((m) => m.fileUrl !== mediaToSet.fileUrl),
        ];
        setRandomQueue(randomQueue);
        queue = randomQueue;
        mediaToSet = randomQueue[0];
      }
      setMedia(mediaToSet);
      try {
        const { sound: createdSound } = await Audio.Sound.createAsync(
          { uri: ipfsURLToHTTPURL(mediaToSet.fileUrl) },
          undefined,
          async (status: AVPlaybackStatus) => {
            if ("uri" in status && status.isLoaded) {
              setPlaybackStatus(status);

              if (status.didJustFinish && !status?.isLooping) {
                // ------- Autoplay queue
                const queueCurrentIndex = queue.indexOf(mediaToSet);
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
                status.error,
              );
              setToastError({
                title: "Error while playbackStatus update: ",
                message: status.error || "",
              });
            }
          },
        );
        // ------- Autoplay createdSound
        // FIXME: Got error when playing video, then playing sound ("Video not loaded yet"), so, have to control this (Video have _nativeRef, but not Sound)
        if (av && !("_nativeRef" in av)) {
          await av?.stopAsync();
          await av?.unloadAsync();
        }
        await createdSound?.playAsync();
        setAv(createdSound);
        setIsMediaPlayerOpen(true);
        // -------
      } catch (e: any) {
        console.error("Error loading sound: ", e.message);
        setToastError({
          title: "Error loading sound: ",
          message: e.message,
        });
      }
    },
    [setToastError, av],
  );

  const firstPlayVideo = async (video: Video, media: Media) => {
    setVideoLastRoute(
      navigation.getState().routes[navigation.getState().routes.length - 1],
    );
    setMedia(media);
    try {
      await av?.stopAsync();
      await av?.unloadAsync();
      setAv(video);
      await video.playAsync();
    } catch (e: any) {
      console.error("Error while first playing video: ", e.message);
      setToastError({
        title: "Error while first playing video: ",
        message: e.message,
      });
    }
    setIsMediaPlayerOpen(true);
  };

  // Used to restore videoRef.current (av) after the current Video has been reloaded.
  // (If not, the playbackStatus is sync correctly, but not the av, and an error occurs "Video has not been loaded yet")
  const onLayoutPlayerVideo = async (video: Video) => {
    await video.pauseAsync();
    await video.setPositionAsync(playbackStatus?.positionMillis || 0);
    setAv(video);
  };

  const onVideoStatusUpdate = (status: AVPlaybackStatusSuccess) => {
    setPlaybackStatus(status);
  };

  // ============== Only used in UI
  const loadAndPlaySoundsQueue = async (
    queue: Media[],
    mediaToStart?: Media,
  ) => {
    setQueue(queue);
    const randomMedia = queue[Math.floor(Math.random() * queue.length)];
    await loadAndPlaySound(
      mediaToStart ? mediaToStart : isRandom ? randomMedia : queue[0],
      queue,
      isRandom,
    );
  };

  const triggerVideoFullscreen = async () => {
    // Before set fullscreen, we redirect to the video's screen, if it changed. Using navigation.getState().routes
    // If not, av._setFullscreen(true) will set the current browser's page as fullscreen without the video :(
    if (
      videoLastRoute?.key !==
      navigation.getState().routes[navigation.getState().routes.length - 1].key
    ) {
      if (media?.postId) {
        navigation.navigate("FeedPostView", {
          id: getNetworkObjectId(selectedNetworkId, media.postId),
        });
      }
    }
    if (av && "_setFullscreen" in av) {
      try {
        await av._setFullscreen(true);
      } catch (e: any) {
        console.error("Error setting full screen: ", e.message);
        setToastError({
          title: "Error setting full screen: ",
          message: e.message,
        });
      }
    }
  };

  const handlePlayPause = async () => {
    if (
      !av ||
      !playbackStatus?.isLoaded ||
      // FIXME: Got error when plying video, then playing sound ("Video not loaded yet"), so, have to control this
      (av && "_nativeRef" in av && !av._nativeRef.current)
    ) {
      return;
    }
    if (playbackStatus.isPlaying) {
      try {
        await av.pauseAsync();
      } catch (e: any) {
        console.error("Error pausing media: ", e.message);
        setToastError({
          title: "Error pausing media: ",
          message: e.message,
        });
      }
    } else {
      try {
        await av.playAsync();
      } catch (e: any) {
        console.error("Error playing media: ", e.message);
        setToastError({
          title: "Error playing media: ",
          message: e.message,
        });
      }
    }
  };

  const queueToUse = useMemo(
    () => (isRandom && randomQueue.length ? randomQueue : queue),
    [isRandom, randomQueue, queue],
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

  const resetMediaPlayer = () => {
    setMedia(undefined);
    setIsMediaPlayerOpen(false);
    setAv(undefined);
    setPlaybackStatus(undefined);
    av?.unloadAsync();
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
        onLayoutPlayerVideo,
        resetMediaPlayer,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
