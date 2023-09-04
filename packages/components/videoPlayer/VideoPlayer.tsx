import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";

import Avatar from "../../../assets/icons/player/avatar.svg";
import Next from "../../../assets/icons/player/next.svg";
import Pause from "../../../assets/icons/player/pause.svg";
import Play from "../../../assets/icons/player/play.svg";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const VideoPlayer: React.FC = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const componentHeight = 48;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: neutral17,
      height: componentHeight,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: neutral22,
      paddingHorizontal: layout.spacing_x3,
    },
    playHandleBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x3,
    },
    verticalLine: {
      height: layout.spacing_x2_5,
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
      gap: layout.spacing_x0_5,
      justifyContent: "center",
    },
    videoBox: {},
  });
  const clickPlayPause = () => {
    setIsPlay(!isPlay);
  };
  return (
    <View style={styles.container}>
      <View style={styles.playHandleBox}>
        <Pressable onPress={clickPlayPause}>
          {isPlay && <SVG source={Pause} height={28} width={28} />}
          {!isPlay && <SVG source={Play} height={28} width={28} />}
        </Pressable>
        <StandardIcon source={Next} />
      </View>
      <View style={styles.durationBox}>
        <SVG
          source={Avatar}
          height={layout.spacing_x4}
          width={layout.spacing_x4}
        />
        <View style={styles.infoBox}>
          <BrandText style={fontSemibold14}>Song Name</BrandText>
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Artist
          </BrandText>
        </View>
      </View>
    </View>
  );
};

const StandardIcon: React.FC<{ source: any }> = ({ source }) => {
  return (
    <Pressable>
      <SVG
        source={source}
        width={layout.spacing_x2_5}
        height={layout.spacing_x2_5}
      />
    </Pressable>
  );
};
