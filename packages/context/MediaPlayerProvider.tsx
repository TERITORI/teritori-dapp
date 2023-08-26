import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import React, {
  createContext,
  useContext,
  useState,
  createRef,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
} from "react";

import { nextItemInArray } from "../utils/arrays";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { Media, PlayType } from "../utils/types/mediaPlayer";

interface DefaultValue {
  ///////// WIP //////
  loadAudio: (media: Media) => Promise<undefined | Audio.Sound>;
  handlePlayPause: () => Promise<void>;
  isPlaying: boolean;
  media?: Media;
  isLoop: boolean;
  isRandom: boolean;
  setIsLoop: Dispatch<SetStateAction<boolean>>;
  setIsRandom: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  timePosition: number; // ms
  lastTimePosition: number; // ms
  setTimePosition: Dispatch<SetStateAction<number>>;
  didJustFinish: boolean;
  isMediaPlayerOpen: boolean;
  setIsMediaPlayerOpen: Dispatch<SetStateAction<boolean>>;
  queue: Media[];
  loadAndPlayQueue: (queue: Media[], mediaToStart?: Media) => Promise<void>;
  loadAndPlayMedia: (media: Media) => Promise<void>;

  ///////// TO REMOVE //////
  isPlay: boolean;
  setIsPlay: Function;
  audioIndex: number;
  setAudioIndex: Function;
  playType: PlayType;
  setPlayType: Function;
  artist: string;
  setArtist: Function;
  // seekbarRef: React.RefObject<HTMLInputElement>;
  // setSeekbarRef: Function;
  audioRef: React.RefObject<HTMLAudioElement>;
  setAudioRef: Function;
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
  timePosition: 0,
  lastTimePosition: 0,
  setTimePosition: () => {},
  didJustFinish: false,
  isMediaPlayerOpen: false,
  setIsMediaPlayerOpen: () => {},
  queue: [],
  loadAndPlayQueue: async () => {},
  loadAndPlayMedia: async () => {},

  isPlay: false,
  setIsPlay: () => {},
  audioIndex: -1,
  setAudioIndex: () => {},
  playType: PlayType.LOOP,
  setPlayType: () => {},
  artist: "",
  setArtist: () => {},
  // seekbarRef: createRef(),
  // setSeekbarRef: () => {},
  audioRef: createRef(),
  setAudioRef: () => {},
};

const MediaPlayerContext = createContext(defaultValue);

export const MediaPlayerContextProvider: React.FC = ({ children }) => {
  const [isPlay, setIsPlay] = useState(defaultValue.isPlay);
  const [audioIndex, setAudioIndex] = useState(defaultValue.audioIndex);
  const [playType, setPlayType] = useState<PlayType>(defaultValue.playType);
  const [artist, setArtist] = useState("");
  const [audioRef, setAudioRef] = useState<React.RefObject<HTMLAudioElement>>(
    defaultValue.audioRef
  );

  /////////////////////////////////////////////////////////////////////
  ///////////////////     WIP     ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////
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
  const [timePosition, setTimePosition] = useState<number>(
    defaultValue.timePosition
  );
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
  const nextMediaInQueue = useMemo(
    () =>
      queue.map((m, index) => {
        if (m.fileUrl !== media?.fileUrl || queue.length <= 1) return;
        return nextItemInArray(queue, index);
      })[0],
    [queue, media?.fileUrl]
  );

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

  // When clicking on a Song
  const loadAudio = useCallback(
    async (media: Media) => {
      const { sound: createdSound } = await Audio.Sound.createAsync(
        { uri: ipfsURLToHTTPURL(media.fileUrl) },
        undefined,
        // TODO: progressUpdateIntervalMillis ?
        // {progressUpdateIntervalMillis: 400},
        (status) => {
          if ("uri" in status) {
            setPlaybackStatus(status);
          }
          //else TODO: handle error here
        }
      );
      if (sound) {
        await sound.unloadAsync();
        setPlaybackStatus(undefined);
        // TODO: handle error here
      }
      await createdSound.setVolumeAsync(volume);
      setSound(createdSound);
      setMedia(media);
      return createdSound;
    },
    [sound, volume]
  );

  const loadAndPlayQueue = async (queue: Media[], mediaStoStart?: Media) => {
    if (!queue.length) return;
    setQueue(queue);
    await loadAndPlayMedia(mediaStoStart || queue[0]);
  };

  const loadAndPlayMedia = async (media: Media) => {
    const createdSound = await loadAudio(media);
    if (!createdSound) return;
    const status = await createdSound.playAsync();
    if (!status.isLoaded) return;
    setIsPlaying(true);
    setMedia(media);
  };

  // Autoplay queue
  useEffect(() => {
    const effect = async () => {
      if (!nextMediaInQueue || isLoop) return;
      const createdSound = await loadAudio(nextMediaInQueue);
      if (!createdSound) return;
      await createdSound.playAsync();
      setMedia(nextMediaInQueue);
    };
    effect();
  }, [didJustFinish, nextMediaInQueue, isLoop, loadAudio]);

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
    if (!playbackStatus) return;
    setLastTimePosition(playbackStatus.positionMillis);
  }, [playbackStatus]);

  // Sync playbackStatus.didJustFinish
  useEffect(() => {
    if (!playbackStatus) return;
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
        timePosition,
        lastTimePosition,
        setTimePosition,
        didJustFinish,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        queue,
        loadAndPlayQueue,
        loadAndPlayMedia,

        isPlay,
        setIsPlay,
        audioIndex,
        setAudioIndex,
        playType,
        setPlayType,
        artist,
        setArtist,
        // seekbarRef,
        // setSeekbarRef,
        audioRef,
        setAudioRef,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
