import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
  isLoop: boolean;
  isRandom: boolean;
  setIsLoop: Dispatch<SetStateAction<boolean>>;
  setIsRandom: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  lastTimePosition: number; // ms
  setTimePosition: Dispatch<SetStateAction<number>>;
  didJustFinish: boolean;
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  loadAndPlayQueue: (queue: Media[], mediaToStart?: Media) => Promise<void>;
  removeSound: () => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
}

const defaultValue: DefaultValue = {
  handlePlayPause: async () => {},
  isPlaying: false,
  media: undefined,
  isLoop: false,
  isRandom: false,
  setIsLoop: () => {},
  setIsRandom: () => {},
  volume: 0.5,
  setVolume: () => {},
  lastTimePosition: 0,
  setTimePosition: () => {},
  didJustFinish: false,
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  loadAndPlayQueue: async () => {},
  removeSound: async () => {},
  canNext: false,
  canPrev: false,
  nextMedia: async () => {},
  prevMedia: async () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC = ({ children }) => {
  const { setToastError } = useFeedbacks();
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(
    defaultValue.isMediaPlayerOpen
  );
  // Queue
  const [queue, setQueue] = useState<Media[]>([]);
  const [isPlaying, setIsPlaying] = useState(defaultValue.isPlaying);
  // Current media in MediaPlayerBar (Used to store UI data)
  const [media, setMedia] = useState(defaultValue.media);
  const [isLoop, setIsLoop] = useState(defaultValue.isLoop);
  //TODO: Handle random
  const [isRandom, setIsRandom] = useState(defaultValue.isRandom);
  const [volume, setVolume] = useState(defaultValue.volume);
  const [timePosition, setTimePosition] = useState<number>(0);
  // Prevents useEffect infinite loop, used in TimerSlider
  const [lastTimePosition, setLastTimePosition] = useState(
    defaultValue.lastTimePosition
  );
  // Current sound
  const [sound, setSound] = useState<Audio.Sound>();
  const [didJustFinish, setDidJustFinish] = useState(
    defaultValue.didJustFinish
  );
  const [playbackStatus, setPlaybackStatus] =
    useState<AVPlaybackStatusSuccess>();

  // Only used in UI imo
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

  const loadSound = useCallback(
    async (media: Media) => {
      setTimePosition(0);
      setLastTimePosition(defaultValue.lastTimePosition);
      setMedia(media);
      setIsPlaying(false);

      try {
        // Force unload existing sound (No need if didJustFinish, because the sound is unloaded when playback is done)
        if (playbackStatus?.isLoaded && sound && !didJustFinish) {
          await sound?.unloadAsync();
        }

        const { sound: createdSound, status: createdStatus } =
          await Audio.Sound.createAsync(
            { uri: ipfsURLToHTTPURL(media.fileUrl) },
            undefined,
            (status) => {
              if ("uri" in status && status.isLoaded) {
                setPlaybackStatus(status);
                setLastTimePosition(status.positionMillis);
                setDidJustFinish(status.didJustFinish);
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
        return { sound: createdSound, status: createdStatus };
      } catch (e) {
        setToastError({
          title: "Error loading sound",
          message: e.message,
        });
        return { sound: undefined, status: undefined };
      }
    },
    [sound, setToastError, didJustFinish, playbackStatus?.isLoaded]
  );

  // When clicking on a Song, or queue automatic play
  const loadAndPlaySound = useCallback(
    async (media: Media) => {
      const { sound: createdSound, status } = await loadSound(media);
      if (!createdSound || !status?.isLoaded) return;
      await createdSound.playAsync();
      setIsPlaying(true);
      setIsMediaPlayerOpen(true);
    },
    [loadSound]
  );

  // We consider playing songs from UI is loadAndPlayQueue([...songs), even for one song
  const loadAndPlayQueue = async (queue: Media[], mediaStoStart?: Media) => {
    if (!queue.length) return;
    setQueue(queue);
    await loadAndPlaySound(mediaStoStart || queue[0]);
  };

  const canNext = useMemo(() => {
    if (!media || queue.length < 2) return false;
    const currentIndex = queue.indexOf(media);
    return currentIndex !== queue.length - 1;
  }, [media, queue]);

  const canPrev = useMemo(() => {
    if (!media || queue.length < 2) return false;
    const currentIndex = queue.indexOf(media);
    return currentIndex !== 0;
  }, [media, queue]);

  const nextMedia = useCallback(async () => {
    if (!canNext || !media) return;
    const currentIndex = queue.indexOf(media);
    await loadAndPlaySound(queue[currentIndex + 1]);
  }, [canNext, media, queue, loadAndPlaySound]);

  const prevMedia = async () => {
    if (!canPrev || !media) return;
    const currentIndex = queue.indexOf(media);
    await loadAndPlaySound(queue[currentIndex - 1]);
  };

  // Force reset MediaPlayer
  const removeSound = async () => {
    if (!sound) return;
    setIsPlaying(false);
    setMedia(undefined);
    await sound.unloadAsync();
  };

  // Autoplay queue
  useEffect(() => {
    const effect = async () => {
      if (isLoop || !didJustFinish) return;
      await nextMedia();
    };
    effect();
  }, [didJustFinish, isLoop, nextMedia]);

  // Sync isLoop from UI
  useEffect(() => {
    if (didJustFinish || !sound) return;
    const effect = async () => {
      await sound.setIsLoopingAsync(isLoop);
    };
    effect();
  }, [didJustFinish, isLoop, sound]);

  // TODO: Sync isRandom

  // Sync volume from UI
  useEffect(() => {
    const effect = async () => {
      if (!sound) return;
      await sound.setVolumeAsync(volume);
    };
    effect();
  }, [volume, sound]);

  // Sync timePosition from UI
  useEffect(() => {
    const effect = async () => {
      if (!sound) return;
      await sound.setPositionAsync(timePosition);
    };
    effect();
  }, [timePosition, sound]);

  return (
    <MediaPlayerContext.Provider
      value={{
        handlePlayPause,
        isPlaying,
        media,
        isLoop,
        isRandom,
        setIsLoop,
        setIsRandom,
        volume,
        setVolume,
        lastTimePosition,
        setTimePosition,
        didJustFinish,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        loadAndPlayQueue,
        removeSound,
        canNext,
        canPrev,
        nextMedia,
        prevMedia,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
