import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";

import Add from "../../../assets/media-player/add.svg";
import Avatar from "../../../assets/media-player/avatar.svg";
import Loop from "../../../assets/media-player/loop.svg";
import LoopOff from "../../../assets/media-player/loop_off.svg";
import Next from "../../../assets/media-player/next.svg";
import Pause from "../../../assets/media-player/pause.svg";
import Play from "../../../assets/media-player/play.svg";
import Previous from "../../../assets/media-player/previous.svg";
import Random from "../../../assets/media-player/random.svg";
import { useMusicplayer } from "../../context/MusicplayerProvider";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { PlayType } from "../../utils/types/music";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
const MediaPlayerBar: React.FC = () => {
  const {
    isPlay,
    setIsPlay,
    audioList,
    audioIndex,
    setAudioIndex,
    playType,
    setPlayType,
    artist,
    audioRef,
    setSeekbarRef,
    duration,
    volume,
    setVolume,
  } = useMusicplayer();

  const seekBarRef = useRef<HTMLInputElement>(null);
  const [songName, setSongName] = useState<string>("");
  const playAnimationRef = useRef(0);
  const repeat = useCallback(() => {
    if (!audioRef.current || !seekBarRef.current) return;
    const currentTime = audioRef.current.currentTime;
    seekBarRef.current.value = currentTime.toString();

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, seekBarRef]);
  useEffect(() => {
    setSeekbarRef(seekBarRef);
  }, [seekBarRef, setSeekbarRef]);
  useEffect(() => {
    if (seekBarRef && seekBarRef.current) {
      seekBarRef.current.max = duration.toString();
    }
  }, [duration, seekBarRef]);
  useEffect(() => {
    if (isPlay && audioRef.current && audioIndex >= 0) {
      audioRef.current.play();
    }
    if (!isPlay && audioRef.current && audioIndex >= 0) {
      audioRef.current.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
    return () => {
      cancelAnimationFrame(playAnimationRef.current);
      // audioRef.current?.pause();
    };
  }, [audioRef, isPlay, audioIndex, repeat]);

  useEffect(() => {
    if (audioList.length > 0 && audioIndex >= 0) {
      setSongName(audioList[audioIndex].name);
    }
  }, [audioList, audioIndex]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      // audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef]);

  const componentHight = 48;
  // const headerHeight = 79;
  // const pagePadding = 50;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: neutral17,
      height: componentHight,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: neutral22,
      paddingHorizontal: layout.padding_x3,
    },
    playHandleBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x3,
    },
    verticalLine: {
      height: layout.padding_x2_5,
      width: 1,
      backgroundColor: neutral33,
    },
    durationBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 40,
    },
    infoBox: {
      flexDirection: "column",
      gap: layout.padding_x0_5,
      justifyContent: "center",
    },
    audioBox: {
      display: "none",
    },
  });
  const clickPlayPause = () => {
    if (audioIndex >= 0) {
      setIsPlay((oldIsPlay: boolean) => !oldIsPlay);
    }
  };
  const clickPreviousAudio = () => {
    if (audioIndex > 0) {
      setAudioIndex(audioIndex - 1);
      setIsPlay(true);
    }
  };
  const clickNextAudio = () => {
    if (audioIndex < audioList.length - 1) {
      setAudioIndex(audioIndex + 1);
      setIsPlay(true);
    }
  };
  const clickRandomAudio = () => {
    if (audioList.length >= 0) {
      setAudioIndex(Math.floor(Math.random() * audioList.length));
      setIsPlay(true);
    }
  };
  const switchLoop = () => {
    switch (playType) {
      case PlayType.LOOP:
        setPlayType(PlayType.LOOP_OFF);
        break;
      case PlayType.LOOP_OFF:
        setPlayType(PlayType.LOOP);
        break;
    }
  };

  const handleSeekbarChange = () => {
    if (!audioRef.current || !seekBarRef.current) return;
    audioRef.current.currentTime = parseFloat(seekBarRef.current.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.playHandleBox}>
        <Pressable onPress={clickRandomAudio}>
          <StandardIcon source={Random} />
        </Pressable>
        <Pressable onPress={clickPreviousAudio}>
          <StandardIcon source={Previous} />
        </Pressable>
        <Pressable onPress={clickPlayPause}>
          {isPlay && <SVG source={Pause} height={28} width={28} />}
          {!isPlay && <SVG source={Play} height={28} width={28} />}
        </Pressable>
        <Pressable onPress={clickNextAudio}>
          <StandardIcon source={Next} />
        </Pressable>
        <Pressable onPress={() => switchLoop()}>
          {playType === PlayType.LOOP && <StandardIcon source={Loop} />}
          {playType === PlayType.LOOP_OFF && <StandardIcon source={LoopOff} />}
        </Pressable>
        <View style={styles.verticalLine} />
        <StandardIcon source={Add} />
      </View>
      <View>
        <input
          type="range"
          ref={seekBarRef}
          onChange={handleSeekbarChange}
          style={{ width: "300px" }}
        />
      </View>
      <View style={styles.durationBox}>
        <SVG
          source={Avatar}
          height={layout.padding_x4}
          width={layout.padding_x4}
        />
        <View style={styles.infoBox}>
          <BrandText style={fontSemibold14}>{songName}</BrandText>
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            {artist}
          </BrandText>
        </View>
        <View>
          <input
            type="range"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value, 10))}
            min={0}
            max={100}
            style={{ width: "100px" }}
          />
        </View>
      </View>
    </View>
  );
};

const StandardIcon: React.FC<{ source: any }> = ({ source }) => {
  return (
    <SVG
      source={source}
      width={layout.padding_x2_5}
      height={layout.padding_x2_5}
    />
  );
};

export default memo(MediaPlayerBar);
