import { memo, useRef, useEffect, useCallback, useState } from "react";
import { View, Pressable, ViewStyle } from "react-native";

import VolumeSvg from "../../../assets/icons/player/audio.svg";
import Pause from "../../../assets/icons/player/pause.svg";
import Play from "../../../assets/icons/player/play.svg";
import { useVideoPlayer } from "../../context/VideoPlayerContext";
import { neutral17, neutral22, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { durationToString } from "../../utils/videoPlayer";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../spacer";

const componentHeight = 48;

const VideoPlayerSeekBar: React.FC = () => {
  const { isPlay, setIsPlay, videoMeta, volume, setVolume, videoRef } =
    useVideoPlayer();
  const seekBarRef = useRef<HTMLInputElement>(null);
  const playAnimationRef = useRef(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const repeat = useCallback(() => {
    if (!videoRef.current || !seekBarRef.current) return;
    const currentTime = videoRef.current.currentTime;
    setCurrentTime(currentTime);
    seekBarRef.current.value = currentTime.toString();

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [videoRef, seekBarRef]);

  useEffect(() => {
    if (seekBarRef && seekBarRef.current) {
      seekBarRef.current.max = videoMeta.duration.toString();
    }
  }, [videoMeta, seekBarRef]);

  useEffect(() => {
    if (isPlay && videoRef.current) {
      videoRef.current.play();
    }
    if (!isPlay && videoRef.current) {
      videoRef.current.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
    return () => {
      cancelAnimationFrame(playAnimationRef.current);
      // audioRef.current?.pause();
    };
  }, [videoRef, isPlay, repeat]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, videoRef]);

  const handleSeekbarChange = () => {
    if (!videoRef.current || !seekBarRef.current) return;
    videoRef.current.currentTime = parseFloat(seekBarRef.current.value);
  };
  const clickPlayPause = () => {
    if (videoMeta.title) {
      setIsPlay((oldIsPlay: boolean) => !oldIsPlay);
    }
  };

  return (
    <View style={containerStyle}>
      <View style={playHandleBoxStyle}>
        <Pressable onPress={clickPlayPause}>
          {isPlay && <SVG source={Pause} height={28} width={28} />}
          {!isPlay && <SVG source={Play} height={28} width={28} />}
        </Pressable>
      </View>
      <View>
        <View style={seekbarBoxStyle}>
          <BrandText style={{ fontSize: 12 }}>
            {durationToString(currentTime)}
          </BrandText>
          <input
            type="range"
            ref={seekBarRef}
            onChange={handleSeekbarChange}
            style={{ width: "300px" }}
          />
          <BrandText style={{ fontSize: 12 }}>
            {durationToString(videoMeta.duration)}
          </BrandText>
        </View>
      </View>
      <View style={infoBoxStyle}>
        <View style={avatarBoxStyle}>
          <UserAvatarWithFrame
            style={{
              marginRight: layout.spacing_x2,
            }}
            userId={videoMeta.createdBy}
            size="S"
          />
          <SpacerRow size={2.5 / 2} />
          <View style={titleUsernameBoxStyle}>
            <BrandText style={fontSemibold14}>{videoMeta.title}</BrandText>
            <SpacerColumn size={0.5} />
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {videoMeta.userName}
            </BrandText>
          </View>
        </View>
        <SpacerRow size={2.5} />
        <View style={volumeBoxStyle}>
          <SVG source={VolumeSvg} />
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
    </View>
  );
};

const containerStyle: ViewStyle = {
  backgroundColor: neutral17,
  height: componentHeight,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: neutral22,
  paddingHorizontal: layout.spacing_x3,
};
const volumeBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const seekbarBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const playHandleBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const infoBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const avatarBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignContent: "center",
};
const titleUsernameBoxStyle: ViewStyle = {
  justifyContent: "center",
};

export default memo(VideoPlayerSeekBar);
