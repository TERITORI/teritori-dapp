import {
  createContext,
  useContext,
  useState,
  createRef,
  Dispatch,
  SetStateAction,
} from "react";
interface VideoPlayerBarMeta {
  title: string;
  createdBy: string;
  userName: string;
  duration: number;
}
interface DefaultValue {
  isPlay: boolean;
  setIsPlay: Function;
  volume: number;
  setVolume: Function;
  videoMeta: VideoPlayerBarMeta;
  setVideoMeta: Dispatch<SetStateAction<VideoPlayerBarMeta>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  setVideoRef: Function;
}
const defaultValue: DefaultValue = {
  isPlay: false,
  setIsPlay: () => {},
  volume: 50,
  setVolume: () => {},
  videoMeta: {
    createdBy: "",
    title: "",
    userName: "",
    duration: 0,
  },
  setVideoMeta: () => {},
  videoRef: createRef(),
  setVideoRef: () => {},
};
const VideoPlayerContext = createContext(defaultValue);

export const VideoPlayerContextProvider: React.FC = ({ children }) => {
  const [isPlay, setIsPlay] = useState(defaultValue.isPlay);
  const [volume, setVolume] = useState<number>(defaultValue.volume);
  const [videoMeta, setVideoMeta] = useState<VideoPlayerBarMeta>(
    defaultValue.videoMeta
  );
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement>>(
    defaultValue.videoRef
  );
  return (
    <VideoPlayerContext.Provider
      value={{
        isPlay,
        setIsPlay,
        volume,
        setVolume,
        videoMeta,
        setVideoMeta,
        videoRef,
        setVideoRef,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};
export const useVideoPlayer = () => useContext(VideoPlayerContext);
