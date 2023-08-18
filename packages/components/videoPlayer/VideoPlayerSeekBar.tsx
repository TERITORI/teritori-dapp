import { memo, useRef, useEffect, useCallback, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";

import VolumeSvg from "../../../assets/icons/player/audio.svg";
// import Next from "../../../assets/icons/player/next.svg";
import Pause from "../../../assets/icons/player/pause.svg";
import Play from "../../../assets/icons/player/play.svg";
import { useVideoPlayer } from "../../context/VideoPlayerContext";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { durationToString } from "../../utils/videoPlayer";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

const componentHight = 48;

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
  volumeBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  seekbarBox: {
    flexDirection: "row",
    alignItems: "center",
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
  inforBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    gap: 10,
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
    <View style={styles.container}>
      <View style={styles.playHandleBox}>
        <Pressable onPress={clickPlayPause}>
          {isPlay && <SVG source={Pause} height={28} width={28} />}
          {!isPlay && <SVG source={Play} height={28} width={28} />}
        </Pressable>
        {/* <Pressable onPress={()=>{}}>
                    <StandardIcon source={Next} />
                </Pressable> */}
      </View>
      <View>
        <View style={styles.seekbarBox}>
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
      <View style={styles.inforBox}>
        <View style={styles.avatarBox}>
          <UserAvatarWithFrame
            style={{
              marginRight: layout.padding_x2,
            }}
            userId={videoMeta.createdBy}
            size="S"
          />
          <View style={styles.infoBox}>
            <BrandText style={fontSemibold14}>{videoMeta.title}</BrandText>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {videoMeta.userName}
            </BrandText>
          </View>
        </View>

        <View style={styles.volumeBox}>
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

// const StandardIcon: React.FC<{ source: any }> = ({ source }) => {
//   return (
//     <SVG
//       source={source}
//       width={layout.padding_x2_5}
//       height={layout.padding_x2_5}
//     />
//   );
// };
export default memo(VideoPlayerSeekBar);
