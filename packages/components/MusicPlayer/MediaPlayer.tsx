import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import Add from "../../../assets/media-player/add.svg";
import Avatar from "../../../assets/media-player/avatar.svg";
import Loop from "../../../assets/media-player/loop.svg";
import Next from "../../../assets/media-player/next.svg";
import Play from "../../../assets/media-player/play.svg";
import Previous from "../../../assets/media-player/previous.svg";
import Random from "../../../assets/media-player/random.svg";
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

export const MediaPlayer: React.FC = () => {
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
    audioBox: {},
  });

  return (
    <View style={styles.container}>
      <View style={styles.playHandleBox}>
        <StandardIcon source={Random} />
        <StandardIcon source={Previous} />
        <Pressable>
          <SVG source={Play} height={28} width={28} />
        </Pressable>
        <StandardIcon source={Next} />
        <StandardIcon source={Loop} />
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
          <BrandText style={fontSemibold14}>Song Name</BrandText>
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            Artist
          </BrandText>
        </View>
      </View>
      <View style={styles.audioBox} />
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