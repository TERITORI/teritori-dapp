import React, { useRef, useEffect, useState } from "react";
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
import { ipfsPinataUrl } from "../../utils/ipfs";
import { neutral17, neutral22, neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { PlayType } from "../../utils/types/music";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const MediaPlayerBar: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlay,
    setIsPlay,
    audioList,
    audioIndex,
    setAudioIndex,
    playType,
    setPlayType,
  } = useMusicplayer();
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [songName, setSongName] = useState<string>("");
  useEffect(() => {
    if (isPlay && audioRef.current && audioIndex >= 0) {
      audioRef.current.play();
    }
    if (!isPlay && audioRef.current && audioIndex >= 0) {
      audioRef.current.pause();
    }
  }, [isPlay, audioIndex]);

  useEffect(() => {
    if (audioList.length > 0 && audioIndex >= 0) {
      setAudioSrc(ipfsPinataUrl(audioList[audioIndex].ipfs));
      setSongName(audioList[audioIndex].name);
    }
  }, [audioList, audioIndex]);

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
        <Pressable onPress={switchLoop}>
          {playType === PlayType.LOOP && <StandardIcon source={Loop} />}
          {playType === PlayType.LOOP_OFF && <StandardIcon source={LoopOff} />}
        </Pressable>
        <View style={styles.verticalLine} />
        <StandardIcon source={Add} />
      </View>
      <View style={styles.durationBox}>
        <SVG
          source={Avatar}
          height={layout.padding_x4}
          width={layout.padding_x4}
        />
        <View style={styles.infoBox}>
          <BrandText style={fontSemibold14}>{songName}</BrandText>
          {/* <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Artist
          </BrandText> */}
        </View>
      </View>
      <View style={styles.audioBox}>
        <audio id="footer_audio" src={audioSrc} ref={audioRef} controls />
      </View>
    </View>
  );
};

const StandardIcon: React.FC<{ source: any }> = ({ source }) => {
  return (
    <Pressable>
      <SVG
        source={source}
        width={layout.padding_x2_5}
        height={layout.padding_x2_5}
      />
    </Pressable>
  );
};
