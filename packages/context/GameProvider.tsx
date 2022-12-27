import { Audio, AVPlaybackSource } from "expo-av";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useSquadStaking } from "../hooks/riotGame/useSquadStaking";

interface DefaultValue {
  playGameAudio: () => void;
  stopAudio: () => void;
  muteAudio: (isMuted: boolean) => void;
  enteredInGame?: boolean;
  setEnteredInGame: (isIt: boolean) => void;
  currentAudio?: Audio.Sound;
}
const defaultValue: DefaultValue = {
  playGameAudio: () => {},
  stopAudio: () => {},
  muteAudio: () => {},
  enteredInGame: false,
  setEnteredInGame: () => {},
  currentAudio: undefined,
};

const GameContext = createContext(defaultValue);

export const GameContextProvider: React.FC = ({ children }) => {
  const [currentAudio, setCurrenAudio] = useState<Audio.Sound>();
  // This flag is used principally to handling audio stuff
  const [enteredInGame, setEnteredInGame] = useState(false);
  const { isStaking } = useSquadStaking();

  const BO_DURING_FIGHT = require("../../assets/game/BO-DURING-THE-FIGHT-THE-RIOT-TORI-P2E.mp3");
  const BO_PREPARE_FIGHT = require("../../assets/game/BO-PREPARE-THE-FIGHT-1-P2E-THE-RIOT-TORI.mp3");

  // Relaunch game audio on isStaking update
  useEffect(() => {
    const effect = async () => {
      if (enteredInGame) {
        await stopAudio();
        playGameAudio();
      }
    };
    effect();
  }, [isStaking]);

  // Launching game audio
  const playGameAudio = () => {
    playAudio(isStaking ? BO_DURING_FIGHT : BO_PREPARE_FIGHT, true);
  };

  // Play an audio
  const playAudio = async (source: AVPlaybackSource, loop = false) => {
    try {
      const audioStatus = await currentAudio?.getStatusAsync();
      // If an audio is currently playing, leave
      if (audioStatus?.isLoaded && audioStatus.isPlaying) return;
      const { sound } = await Audio.Sound.createAsync(source);
      setCurrenAudio(sound);
      await sound.setIsLoopingAsync(loop);
      await sound.playAsync();
    } catch (e) {
      console.error("Playing audio failed:", e);
    }
  };

  // Stop the current audio
  const stopAudio = async () => {
    try {
      // If no audio, leave
      if (!currentAudio) return;
      const audioStatus = await currentAudio.getStatusAsync();

      // If no audio currently playing, leave
      if (!audioStatus.isLoaded) return;
      await currentAudio.stopAsync();
      await currentAudio.unloadAsync();
      setCurrenAudio(undefined);
    } catch (e) {
      console.error("Stopping audio failed:", e);
    }
  };

  // Mute the current audio
  const muteAudio = async (isMuted: boolean) => {
    try {
      // If no audio, leave
      if (!currentAudio) return;
      const audioStatus = await currentAudio.getStatusAsync();
      // If no audio currently playing, leave
      if (!audioStatus.isLoaded) return;
      await currentAudio.setIsMutedAsync(isMuted);
    } catch (e) {
      console.error("Stopping audio failed:", e);
    }
  };

  return (
    <GameContext.Provider
      value={{
        playGameAudio,
        stopAudio,
        muteAudio,
        enteredInGame,
        setEnteredInGame,
        currentAudio,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
