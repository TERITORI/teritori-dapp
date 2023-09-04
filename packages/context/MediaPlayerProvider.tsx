import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { shuffle } from "lodash";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
} from "react";

import { useFeedbacks } from "./FeedbacksProvider";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { Media } from "../utils/types/mediaPlayer";

interface DefaultValue {
  handlePlayPause: () => Promise<void>;
  isPlaying: boolean;
  media?: Media;
  isRandom: boolean;
  setIsRandom: Dispatch<SetStateAction<boolean>>;
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  loadAndPlayQueue: (queue: Media[], mediaToStart?: Media) => Promise<void>;
  removeSound: () => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
  onChangeTimerPosition: (value: number) => void;
  onChangeVolume: (value: number) => void;
  onToggleLoop: () => void;
  playbackStatus?: AVPlaybackStatusSuccess;
}

const defaultValue: DefaultValue = {
  handlePlayPause: async () => {},
  isPlaying: false,
  media: undefined,
  isRandom: false,
  setIsRandom: () => {},
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  loadAndPlayQueue: async () => {},
  removeSound: async () => {},
  canNext: false,
  canPrev: false,
  nextMedia: async () => {},
  prevMedia: async () => {},
  onChangeTimerPosition: () => {},
  onChangeVolume: () => {},
  onToggleLoop: () => {},
  playbackStatus: undefined,
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
  const [sound, setSound] = useState<Audio.Sound>();
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
                setIsPlaying(false);
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
        setSound(createdSound);

        // ------- Autoplay createdSound
        await sound?.unloadAsync();
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
    [setToastError, sound]
  );

  // ============== Only used in UI
  const loadAndPlayQueue = async (queue: Media[], mediaToStart?: Media) => {
    setQueue(queue);
    const randomMedia = queue[Math.floor(Math.random() * queue.length)];
    await loadAndPlaySound(
      mediaToStart ? mediaToStart : isRandom ? randomMedia : queue[0],
      queue,
      isRandom
    );
  };

  const handlePlayPause = async () => {
    if (!sound || !playbackStatus?.isLoaded) {
      return;
    }
    if (playbackStatus.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
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

  // Force reset MediaPlayer
  const removeSound = async () => {
    if (!sound) return;
    setIsPlaying(false);
    setMedia(undefined);
    await sound.unloadAsync();
  };

  const onChangeTimerPosition = (value: number) =>
    sound?.setPositionAsync(value);

  const onChangeVolume = (value: number) =>
    sound?.setVolumeAsync(isNaN(value) ? 0 : value); // value is NaN in local dev env sometimes

  const onToggleLoop = () => {
    sound?.setIsLoopingAsync(!playbackStatus?.isLooping);
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
        loadAndPlayQueue,
        removeSound,
        canNext,
        canPrev,
        nextMedia,
        prevMedia,
        onChangeTimerPosition,
        onChangeVolume,
        onToggleLoop,
        playbackStatus,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
