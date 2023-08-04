import React, { createContext, useContext, useState } from "react";

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
};

const MusicplayerContext = createContext(defaultValue);

export const MusicplayerContextProvider: React.FC = ({ children }) => {
  const [isPlay, setIsPlay] = useState(defaultValue.isPlay);
  const [audioList, setAudioList] = useState(defaultValue.audioList);
  const [audioIndex, setAudioIndex] = useState(defaultValue.audioIndex);
  const [playType, setPlayType] = useState<PlayType>(defaultValue.playType);
  const [artist, setArtist] = useState("");
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
      }}
    >
      {children}
    </MusicplayerContext.Provider>
  );
};

export const useMusicplayer = () => useContext(MusicplayerContext);
