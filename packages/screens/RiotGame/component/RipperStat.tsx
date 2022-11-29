import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import {
  yellowDefault,
  neutral33,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontMedium48,
  fontMedium14,
  fontMedium32,
  fontMedium13,
} from "../../../utils/style/fonts";

type RipperStatProps = {
  name: string;
  value?: number;
  containerStyle?: ViewStyle;
  size?: "MD" | "LG";
};

export const RipperStat: React.FC<RipperStatProps> = ({
  name,
  value = 0,
  containerStyle,
  size = "MD",
}) => {
  let valueFont;
  let subTextFont;

  switch (size) {
    case "LG":
      valueFont = fontMedium48;
      subTextFont = fontMedium14;
      break;
    case "MD":
    default:
      valueFont = fontMedium32;
      subTextFont = fontMedium13;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <BrandText style={[valueFont, styles.leftCol]}>{value}</BrandText>

      <View style={styles.rightCol}>
        <View style={styles.progressBarOuter}>
          <View style={[styles.processBarInner, { width: `${value}%` }]} />
        </View>

        <BrandText style={[subTextFont, styles.subText]}>{name}</BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftCol: {
    minWidth: 80,
  },
  rightCol: {
    marginLeft: 40,
  },
  progressBarOuter: {
    borderRadius: 100,
    height: 8,
    backgroundColor: neutral33,
    width: 164,
  },
  processBarInner: {
    borderRadius: 100,
    height: 8,
    backgroundColor: yellowDefault,
    position: "absolute",
    top: 0,
    left: 0,
  },
  subText: {
    color: neutralA3,
    marginTop: 6,
  },
});
