import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import HomeSelected from "../../../assets/icons/player/home-selected.svg";
import HomeUnselected from "../../../assets/icons/player/home-unselected.svg";
import MusicSelected from "../../../assets/icons/player/music-selected.svg";
import MusicUnselected from "../../../assets/icons/player/music-unselected.svg";
import { neutral33, neutralA3, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText/BrandText.electron";
import { SVG } from "../SVG";

interface VideoPlayerTabProps {
  tab?: string;
  setTab?: any;
}

export const VideoPlayerTab: React.FC<VideoPlayerTabProps> = ({
  tab,
  setTab,
}) => {
  const tabData: string[] = ["Home", "My Library", "Search"];

  const styles = StyleSheet.create({
    tabContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      gap: layout.spacing_x3,
    },
    selectedUnitBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x1_5,
      paddingVertical: layout.spacing_x2_5,
      borderBottomColor: secondaryColor,
      borderBottomWidth: 2,
      paddingRight: 6,
    },
    unselectedUnitBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x1_5,
      paddingVertical: layout.spacing_x2_5,
      borderBottomColor: secondaryColor,
      borderBottomWidth: 0,
      paddingRight: 6,
    },
    selectedText: StyleSheet.flatten([fontSemibold14]),
    unselectedText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    divideLine: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: 1,
      backgroundColor: neutral33,
      width: "100%",
    },
  });

  return (
    <View style={styles.tabContainer}>
      <Pressable
        style={
          tab === tabData[0] ? styles.selectedUnitBox : styles.unselectedUnitBox
        }
        onPress={() => setTab(tabData[0])}
      >
        <SVG
          source={tab === tabData[0] ? HomeSelected : HomeUnselected}
          width={layout.spacing_x3}
          height={layout.spacing_x3}
        />
        <BrandText
          style={
            tab === tabData[0] ? styles.selectedText : styles.unselectedText
          }
        >
          Home
        </BrandText>
      </Pressable>
      <Pressable
        style={
          tab === tabData[1] ? styles.selectedUnitBox : styles.unselectedUnitBox
        }
        onPress={() => setTab(tabData[1])}
      >
        <SVG
          source={tab === tabData[1] ? MusicSelected : MusicUnselected}
          width={layout.spacing_x3}
          height={layout.spacing_x3}
        />
        <BrandText
          style={
            tab === tabData[1] ? styles.selectedText : styles.unselectedText
          }
        >
          My Library
        </BrandText>
      </Pressable>
      <View style={styles.divideLine} />
    </View>
  );
};
