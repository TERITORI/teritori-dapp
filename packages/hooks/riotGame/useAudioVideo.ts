// import {useEffect, useState} from "react";
// import {Audio, AVPlaybackSource} from "expo-av";
// import {useSquadStaking} from "./useSquadStaking";
// import BO_DURING_FIGHT from "../../../assets/game/BO-DURING-THE-FIGHT-THE-RIOT-TORI-P2E.mp3";
// import BO_PREPARE_FIGHT from "../../../assets/game/BO-PREPARE-THE-FIGHT-1-P2E-THE-RIOT-TORI.mp3";
//
// export const useAudioVideo = () => {
//   const [currentAudio, setCurrenAudio] = useState<Audio.Sound>()
//   const [enteredInGame, setEnteredInGame] = useState(false)
//
//   const {isStaking, squadStakingQueryClient
//   } = useSquadStaking();
//
//   useEffect(() => {
//     // console.log('enteredInGameenteredInGameenteredInGameenteredInGame', enteredInGame)
//   }, [enteredInGame])
//
//
//   useEffect(() => {
//     const effect = async () => {
//       await stopAudio()
//       if(enteredInGame) await playAudio(isStaking ? BO_DURING_FIGHT : BO_PREPARE_FIGHT, true)
//     }
//     effect()
//   }, [isStaking, enteredInGame])
//
//   const playAudio = async (source: AVPlaybackSource, loop= false) => {
//     try {
//       const audioStatus = await currentAudio?.getStatusAsync()
//       console.log('audioStatusaudioStatusaudioStatusaudioStatus', audioStatus)
//       // If an audio is currently playing, leave
//       if(audioStatus?.isLoaded) return
//
//       const { sound } = await Audio.Sound.createAsync(source);
//
//       setCurrenAudio(sound);
//       await sound.setIsLoopingAsync(loop)
//       await sound.playAsync();
//     }
//
//     catch (e) {
//       console.error("Playing audio failed:",e)
//     }
//   }
//
//   const stopAudio = async () => {
//     try {
//       // If no audio, leave
//       if (!currentAudio) return
//       const audioStatus = await currentAudio.getStatusAsync()
//
//       // If no audio currently playing, leave
//       if (!audioStatus.isLoaded) return
//
//       await currentAudio.stopAsync()
//       await currentAudio.unloadAsync();
//       setCurrenAudio(undefined)
//     }
//     catch (e) {
//       console.error("Stopping audio failed:",e)
//     }
//   }
//
//   return {
//     playAudio,
//     stopAudio,
//     enteredInGame,
//     setEnteredInGame}
// }
