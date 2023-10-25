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
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleProp, ViewStyle } from "react-native";

import { useFeedbacks } from "./FeedbacksProvider";
import { useIsDAO } from "../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { nameServiceDefaultImage } from "../utils/tns";
import { Media } from "../utils/types/mediaPlayer";
import { VideoMetaInfo } from "../utils/types/video";

interface MediaPlayerVideoProps {
  videoMetaInfo: VideoMetaInfo;
  videoId?: string;
  authorId: string;
  postId?: string;
  resizeMode?: ResizeMode;
  style?: StyleProp<ViewStyle>;
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
  removeAv: () => Promise<void>;
  canNext: boolean;
  canPrev: boolean;
  nextMedia: () => Promise<void>;
  prevMedia: () => Promise<void>;
  onChangeTimerPosition: (value: number) => void;
  onChangeVolume: (value: number) => void;
  onToggleLoop: () => void;
  playbackStatus?: AVPlaybackStatusSuccess;
  onVideoStatusUpdate: (
    status: AVPlaybackStatus,
    videoRef: RefObject<Video>,
    media: Media
    // ) => Promise<AVPlaybackStatusSuccess|undefined>;
  ) => Promise<void>;
  setVideoRef: Dispatch<SetStateAction<RefObject<Video> | null>>;
  videoRef: RefObject<Video> | null;
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
  removeAv: async () => {},
  canNext: false,
  canPrev: false,
  nextMedia: async () => {},
  prevMedia: async () => {},
  onChangeTimerPosition: () => {},
  onChangeVolume: () => {},
  onToggleLoop: () => {},
  playbackStatus: undefined,
  // onVideoStatusUpdate: async () => undefined,
  onVideoStatusUpdate: async () => {},
  setVideoRef: () => {},
  videoRef: null,
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
  const [videoRef, setVideoRef] = useState(defaultValue.videoRef);
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

  const onVideoStatusUpdate = async (
    status: AVPlaybackStatus,
    videoRef: RefObject<Video>,
    mediaToSet: Media
  ) => {
    console.log("statusstatusstatus", status);
    if ("uri" in status && status.isLoaded && videoRef.current) {
      console.log("statusuuuuu", status);
      console.log("mediaToSet.fileUrl", mediaToSet.fileUrl);
      console.log("media?.fileUrl", media?.fileUrl);

      if (status.isPlaying) {
        console.log(
          "============== status.positionMillis",
          status.positionMillis
        );
      }

      // ---- When Video player appears, if media in Provider, set Video player status as Provider status
      if (
        status.positionMillis === 0 &&
        media &&
        mediaToSet.fileUrl === media?.fileUrl
      ) {
        console.log("AAAAAAAAAAAA");
        // return playbackStatus
        return;
      }

      // ---- When Video player appears, at first play, if no media in Provider, set it
      if (
        // status.positionMillis === 0 &&
        status.isPlaying &&
        !media
        // status.isPlaying && (!media || mediaToSet.fileUrl !== media?.fileUrl)
      ) {
        console.log("BBBBBBBBBB");

        mediaToSet.duration = status.durationMillis;
        setMedia(mediaToSet);
        await av?.unloadAsync();
        setAv(videoRef.current);
        setIsPlaying(true);
        setIsMediaPlayerOpen(true);
      }

      // ---- If media in Provider, and Video player already played, continue sync Provider
      if (
        media &&
        mediaToSet.fileUrl === media?.fileUrl &&
        status.positionMillis > 0
      ) {
        console.log("CCCCCCCCC");
        setPlaybackStatus(status);
        setIsPlaying(status.isPlaying);
      }

      // if(media && mediaToSet.fileUrl === media?.fileUrl) {
      //   // setVideoRef(videoRef)
      //   setPlaybackStatus(status);
      //   setIsPlaying(status.isPlaying);
      //   // if(playbackStatus?.positionMillis !== status.positionMillis) {
      //   //   return playbackStatus
      //   //   // await video.setPositionAsync(playbackStatus?.positionMillis || status.positionMillis)
      //   // }
      //   // if(playbackStatus?.volume !== status.volume) {
      //   //   await video.setVolumeAsync(playbackStatus?.volume || status.volume)
      //   // }
      // }
      // if(status.isPlaying && (!media || mediaToSet.fileUrl !== media?.fileUrl)) {
      //   mediaToSet.duration = status.durationMillis;
      //   setMedia(mediaToSet);
      //   await av?.unloadAsync();
      //   setAv(videoRef.current);
      //   setIsPlaying(true);
      //   setIsMediaPlayerOpen(true);
      // }

      // if (status.isPlaying && mediaToSet.fileUrl !== media?.fileUrl) {
      //   mediaToSet.duration = status.durationMillis;
      //   setMedia(mediaToSet);
      //   await av?.unloadAsync();
      //   setAv(video);
      //   setIsPlaying(true);
      //   setIsMediaPlayerOpen(true);
      // }
      // return status
      //
      // if(status.isPlaying && !media) {
      //   mediaToSet.duration = status.durationMillis;
      //   setMedia(mediaToSet);
      //   await av?.unloadAsync();
      //   setAv(video);
      //   setPlaybackStatus(status);
      //   setIsPlaying(true);
      //   setIsMediaPlayerOpen(true);
      //   return status
      // }
      // if(status.isPlaying && status.positionMillis !== playbackStatus?.positionMillis) {
      //
      // }
      // if(media) {
      //   return playbackStatus
      // }

      // if(mediaToSet.fileUrl === media?.fileUrl) {
      //   setPlaybackStatus(status);
      //   setIsPlaying(status.isPlaying);
      //   if (status.didJustFinish && !status.isLooping) {
      //     setIsPlaying(false);
      //   }
      // }
      // // On playing another video, we just sync with MediaPlayer states. The AV is played from the Video component (See MediaPlayerVideo)
      // if (status.isPlaying && mediaToSet.fileUrl !== media?.fileUrl) {
      //   mediaToSet.duration = status.durationMillis;
      //   setMedia(mediaToSet);
      //   await av?.unloadAsync();
      //   setAv(video);
      //   setIsPlaying(true);
      //   setIsMediaPlayerOpen(true);
      // }
    }
    if ("error" in status) {
      console.error("Error while playbackStatus update: ", status.error);
      setToastError({
        title: "Error while playbackStatus update",
        message: status.error || "",
      });
    }
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
  const removeAv = async () => {
    if (!av) return;
    setIsPlaying(false);
    setMedia(undefined);
    await av.unloadAsync();
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
        isPlaying,
        media,
        isRandom,
        setIsRandom,
        isMediaPlayerOpen,
        setIsMediaPlayerOpen,
        loadAndPlaySoundsQueue,
        removeAv,
        canNext,
        canPrev,
        nextMedia,
        prevMedia,
        onChangeTimerPosition,
        onChangeVolume,
        onToggleLoop,
        playbackStatus,
        onVideoStatusUpdate,
        setVideoRef,
        videoRef,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);

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
  const { isDAO } = useIsDAO(authorId);
  const { media, onVideoStatusUpdate, videoRef, setVideoRef, playbackStatus } =
    useMediaPlayer();
  const [isVideoPlayerNeedUpdate, setVideoPlayerNeedUpdate] = useState(false);
  const isInMediaPlayer = useMemo(
    () => media?.postId === postId,
    [postId, media?.postId]
  );

  if (postId === "6fbc928e-a0bf-4bf3-821d-e60c9a794382") {
    console.log("isInMediaPlayerisInMediaPlayer", isInMediaPlayer);
  }

  const newVideoRef = useRef<Video>(null);

  // newVideoRef?.current?.addEventListener("play", (event) => {
  //   console.log(
  //     "The Boolean paused property is now 'false'. Either the play() method was called or the autoplay attribute was toggled.",
  //   );
  // });

  // const videoRefToUse = isInMediaPlayer ? videoRef : newVideoRef;
  const [localStatus, setLocalStatus] = useState<AVPlaybackStatus>();

  const mediaToSet: Media = useMemo(() => {
    return {
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
  }, []);

  // useEffect(() => {
  //   setVideoRef(videoRefToUse);
  // }, [videoRefToUse, setVideoRef]);

  // const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
  //   // setLocalStatus(status)
  //   const mediaToSet: Media = {
  //     imageUrl:
  //       videoMetaInfo.image ||
  //       userInfo.metadata.image ||
  //       nameServiceDefaultImage(isDAO, selectedNetwork),
  //     name: videoMetaInfo.title,
  //     createdBy: authorId,
  //     fileUrl: videoMetaInfo.url,
  //     duration: videoMetaInfo.duration,
  //     // postId is used to difference videos from Social Feed (News feed or Article consultation)
  //     postId: postId || Math.floor(Math.random() * 200000).toString(),
  //     videoId: videoId || ""
  //   };
  //   // await onVideoStatusUpdate(status, newVideoRef.current, mediaToSet);
  //   const newStatus = await onVideoStatusUpdate(status, newVideoRef, mediaToSet)
  //   setLocalStatus(newStatus)
  // };

  // Invert Provider and Video player statuses up/down: If there is a media in the Provider, the Provider updates the Video player
  // useEffect(() => {
  //   setVideoPlayerNeedUpdate(!!media)
  // }, [media])

  // useLayoutEffect(() => {
  //   console.log('onLayoutonLayout')
  //   setVideoPlayerNeedUpdate(true)
  // })

  return (
    <Video
      ref={newVideoRef}
      status={playbackStatus}
      onPlaybackStatusUpdate={(status) =>
        onVideoStatusUpdate(status, newVideoRef, mediaToSet)
      }
      useNativeControls
      source={{
        uri: ipfsURLToHTTPURL(videoMetaInfo.url),
      }}
      style={style}
      resizeMode={resizeMode}

      // Invert Provider and Video player statuses up/down: When the Video player appears, the Video player updates the Provider
      // onLayout={() => {
      //   console.log('onLayoutonLayout')
      //   setVideoPlayerNeedUpdate(true)
      // }}
    />
  );
};
