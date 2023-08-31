import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
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
  lastTimePosition: number; // ms
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  loadAndPlayQueue: (queue: Media[], mediaToStart?: Media) => Promise<void>;
  loadAndPlaySound: (media: Media, queue?: Media[]) => Promise<void>;
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
  lastTimePosition: 0,
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  loadAndPlayQueue: async () => {},
  loadAndPlaySound: async () => {},
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
  const [isPlaying, setIsPlaying] = useState(defaultValue.isPlaying);
  const [media, setMedia] = useState(defaultValue.media);
  const [lastTimePosition, setLastTimePosition] = useState(
    defaultValue.lastTimePosition
  );
  // ------
  const { setToastError } = useFeedbacks();
  const [isRandom, setIsRandom] = useState(defaultValue.isRandom);
  const [sound, setSound] = useState<Audio.Sound>();
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
              setLastTimePosition(status.positionMillis);

              if (status.didJustFinish && !status?.isLooping) {
                setIsPlaying(false);
                // ------- Autoplay queue
                if (!queue) return;
                const queueCurrentIndex = media ? queue.indexOf(media) : -1;
                if (
                  queueCurrentIndex === -1 ||
                  queue.length < 2 ||
                  queueCurrentIndex === queue.length - 1
                )
                  return;
                let nextIndex = queueCurrentIndex + 1;
                if (isRandom) {
                  nextIndex = Math.floor(Math.random() * queue.length);
                }
                await loadAndPlaySound(queue[nextIndex], queue);
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
    [setToastError, isRandom, sound]
  );

  // ------- Only used in UI
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

  const loadAndPlayQueue = async (_queue: Media[], mediaStoStart?: Media) => {
    setQueue(_queue);
    if (isRandom) {
      mediaStoStart = _queue[Math.floor(Math.random() * _queue.length)];
    }
    await loadAndPlaySound(mediaStoStart || _queue[0], _queue);
  };

  const queueCurrentIndex = media ? queue.indexOf(media) : -1;
  const canNext = useMemo(() => {
    if (queueCurrentIndex === -1 || queue.length < 2) return false;
    return queueCurrentIndex !== queue.length - 1;
  }, [queue, queueCurrentIndex]);
  const canPrev = useMemo(() => {
    if (queueCurrentIndex === -1 || queue.length < 2) return false;
    return queueCurrentIndex !== 0;
  }, [queue, queueCurrentIndex]);

  const nextMedia = async () => {
    if (!canNext || queueCurrentIndex === -1) return;
    let nextIndex = queueCurrentIndex + 1;
    //TODO: Better isRandom handling: Do nextMedia even if the last song of the list is played -> count played songs.
    if (isRandom) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    await loadAndPlaySound(queue[nextIndex], queue);
  };
  const prevMedia = async () => {
    if (!canPrev || queueCurrentIndex === -1) return;
    const prevIndex = queueCurrentIndex - 1;
    await loadAndPlaySound(queue[prevIndex], queue);
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

  const onChangeVolume = async (value: number) =>
    await sound?.setVolumeAsync(value);

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
        lastTimePosition,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        loadAndPlayQueue,
        loadAndPlaySound,
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
