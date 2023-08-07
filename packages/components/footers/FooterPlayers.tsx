import { useState, useEffect, useRef } from "react";

import { useMusicplayer } from "../../context/MusicplayerProvider";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { PlayType } from "../../utils/types/music";
const FooterPlayers = () => {
  const {
    isPlay,
    setIsPlay,
    audioList,
    audioIndex,
    playType,
    setAudioRef,
    setDuration,
  } = useMusicplayer();
  const [audioSrc, setAudioSrc] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setAudioRef(audioRef);
  }, [audioRef, setAudioRef]);
  useEffect(() => {
    if (audioList.length > 0 && audioIndex >= 0) {
      setAudioSrc(ipfsURLToHTTPURL(audioList[audioIndex].ipfs));
    }
  }, [audioList, audioIndex]);

  const onLoadedMetadata = () => {
    if (!audioRef.current) return;
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleMusicEnd = () => {
    if (playType === PlayType.LOOP) {
      audioRef.current?.play();
    } else {
      setIsPlay(false);
    }
  };
  return (
    <>
      <audio
        id="footer_audio"
        src={audioSrc}
        defaultValue={0}
        ref={audioRef}
        style={{ display: "none" }}
        controls
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleMusicEnd}
      />
    </>
  );
};
export default FooterPlayers;
