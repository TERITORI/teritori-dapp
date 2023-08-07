import React, { createContext, useContext, useState, createRef } from "react";

import { PlayType, UploadFileInfo } from "../utils/types/music";
interface DefaultValue {
  isPlay: boolean;
  setIsPlay: Function;
  audioList: UploadFileInfo[];
  setAudioList: Function;
  audioIndex: number;
  setAudioIndex: Function;
  playType: PlayType;
  setPlayType: Function;
  artist: string;
  setArtist: Function;
  seekbarRef: React.RefObject<HTMLInputElement>;
  setSeekbarRef: Function;
  audioRef: React.RefObject<HTMLAudioElement>;
  setAudioRef: Function;
  duration: number;
  setDuration: Function;
  volume: number;
  setVolume: Function;
}

const defaultValue: DefaultValue = {
  isPlay: false,
  setIsPlay: () => {},
  audioList: [],
  setAudioList: () => {},
  audioIndex: -1,
  setAudioIndex: () => {},
  playType: PlayType.LOOP,
  setPlayType: () => {},
  artist: "",
  setArtist: () => {},
  seekbarRef: createRef(),
  setSeekbarRef: () => {},
  audioRef: createRef(),
  setAudioRef: () => {},
  duration: 0,
  setDuration: () => {},
  volume: 50,
  setVolume: () => {},
};

const MusicplayerContext = createContext(defaultValue);

export const MusicplayerContextProvider: React.FC = ({ children }) => {
  const [isPlay, setIsPlay] = useState(defaultValue.isPlay);
  const [audioList, setAudioList] = useState(defaultValue.audioList);
  const [audioIndex, setAudioIndex] = useState(defaultValue.audioIndex);
  const [playType, setPlayType] = useState<PlayType>(defaultValue.playType);
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState<number>(defaultValue.duration);
  const [seekbarRef, setSeekbarRef] = useState<
    React.RefObject<HTMLInputElement>
  >(defaultValue.seekbarRef);
  const [audioRef, setAudioRef] = useState<React.RefObject<HTMLAudioElement>>(
    defaultValue.audioRef
  );
  const [volume, setVolume] = useState<number>(defaultValue.volume);
  return (
    <MusicplayerContext.Provider
      value={{
        isPlay,
        setIsPlay,
        audioList,
        setAudioList,
        audioIndex,
        setAudioIndex,
        playType,
        setPlayType,
        artist,
        setArtist,
        seekbarRef,
        setSeekbarRef,
        audioRef,
        setAudioRef,
        duration,
        setDuration,
        volume,
        setVolume,
      }}
    >
      {children}
    </MusicplayerContext.Provider>
  );
};

export const useMusicplayer = () => useContext(MusicplayerContext);
