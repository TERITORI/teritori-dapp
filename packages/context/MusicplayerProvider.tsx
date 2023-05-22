import React, { createContext, useContext, useState } from "react";

interface DefaultValue {
  isPlay: boolean;
  audioSrc: string;
  setIsPlay?: any;
  setAudioSrc?: any;
}

const defaultValue: DefaultValue = {
  isPlay: false,
  audioSrc: "",
};

const MusicplayerContext = createContext(defaultValue);

export const MusicplayerContextProvider: React.FC = ({ children }) => {
  const [isPlay, setIsPlay] = useState(defaultValue.isPlay);
  const [audioSrc, setAudioSrc] = useState(defaultValue.audioSrc);

  return (
    <MusicplayerContext.Provider
      value={{
        isPlay,
        audioSrc,
        setIsPlay,
        setAudioSrc,
      }}
    >
      {children}
    </MusicplayerContext.Provider>
  );
};

export const useMusicplayer = () => useContext(MusicplayerContext);
