import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
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

import { nextItemInArray } from "../utils/arrays";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { Media } from "../utils/types/mediaPlayer";

interface DefaultValue {
  loadAudio: (
    media: Media
  ) => Promise<
    | { createdSound: Audio.Sound; createdStatus: AVPlaybackStatus | undefined }
    | undefined
  >;
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
  queue: Media[];
  loadAndPlayQueue: (queue: Media[], mediaToStart?: Media) => Promise<void>;
  loadAndPlayAudio: (media: Media) => Promise<void>;
  unloadAudio: () => Promise<void>;
}

const defaultValue: DefaultValue = {
  loadAudio: async () => undefined,
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
  queue: [],
  loadAndPlayQueue: async () => {},
  loadAndPlayAudio: async () => {},
  unloadAudio: async () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC = ({ children }) => {
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(
    defaultValue.isMediaPlayerOpen
  );
  // Queue
  const [queue, setQueue] = useState(defaultValue.queue);
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
  const nextMediaInQueue = useMemo(() => {
    let nextMedia: Media | undefined;
    queue.forEach((m, index) => {
      console.log(" ))))) m.fileUrl", m.fileUrl);
      console.log(" ))))) media?.fileUrl", media?.fileUrl);
      console.log(" ))))) queue", queue);
      console.log(" ))))) indexindex", index);
      console.log(
        " ))))) nextItemInArray(queue, index)",
        nextItemInArray(queue, index)
      );
      if (m.fileUrl !== media?.fileUrl || queue.length <= 1) return;
      nextMedia = nextItemInArray(queue, index);
    });
    return nextMedia;
  }, [queue, media?.fileUrl]);

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

  // When clicking on a Song, or queue automatic play
  const loadAudio = useCallback(
    async (media: Media) => {
      // Remove existing sound
      console.log("================= soundsound", sound);
      console.log("================= playbackStatus", playbackStatus);
      if (sound && playbackStatus?.isLoaded) {
        //FIXME : Error: Cannot complete operation because sound is not loaded.
        //     at Sound._performOperationAndHandleStatusAsync$ (Sound.ts:105:1)
        // ==> But sound._isLoaded = true and unloadAsync() works.... WTF
        await sound.unloadAsync();

        setPlaybackStatus(undefined);
      }
      setTimePosition(0);
      setLastTimePosition(defaultValue.lastTimePosition);
      // Init new sound
      const { sound: createdSound, status: createdStatus } =
        await Audio.Sound.createAsync(
          { uri: ipfsURLToHTTPURL(media.fileUrl) },
          { progressUpdateIntervalMillis: 1000 },
          (status) => {
            if ("uri" in status) {
              setPlaybackStatus(status);
            }
            //else TODO: handle error here
          }
        );
      setSound(createdSound);
      setMedia(media);
      return { createdSound, createdStatus };
    },
    [sound, playbackStatus]
  );

  const loadAndPlayQueue = async (queue: Media[], mediaStoStart?: Media) => {
    if (!queue.length) return;
    setQueue(queue);
    await loadAndPlayAudio(mediaStoStart || queue[0]);
  };

  const loadAndPlayAudio = useCallback(
    async (media: Media) => {
      const { createdSound, createdStatus } = await loadAudio(media);
      if (!createdSound || !createdStatus?.isLoaded) return;

      console.log("createdSoundcreatedSoundcreatedSound", createdSound);
      console.log("createdStatuscreatedStatuscreatedStatus", createdStatus);

      console.log(
        "111 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX "
      );
      await createdSound.playAsync();
      console.log(
        "222 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX "
      );

      setIsPlaying(true);
      setIsMediaPlayerOpen(true);
    },
    [loadAudio]
  );

  const unloadAudio = async () => {
    if (!sound) return;
    setIsPlaying(false);
    setMedia(undefined);
    await sound?.unloadAsync();
  };

  // Autoplay queue
  useEffect(() => {
    const effect = async () => {
      if (!nextMediaInQueue || isLoop || !didJustFinish) return;
      await loadAndPlayAudio(nextMediaInQueue);
    };
    effect();
  }, [didJustFinish, nextMediaInQueue, isLoop, loadAndPlayAudio]);

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

  // Sync playbackStatus.positionMillis
  useEffect(() => {
    if (!playbackStatus?.isLoaded) return;
    setLastTimePosition(playbackStatus.positionMillis);
  }, [playbackStatus]);

  // Sync playbackStatus.didJustFinish
  useEffect(() => {
    if (!playbackStatus?.isLoaded) return;
    setDidJustFinish(playbackStatus.didJustFinish);
  }, [playbackStatus]);

  return (
    <MediaPlayerContext.Provider
      value={{
        loadAudio,
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
        queue,
        loadAndPlayQueue,
        loadAndPlayAudio,
        unloadAudio,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
