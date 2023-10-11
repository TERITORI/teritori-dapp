import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import penSVG from "../../../../../assets/icons/pen.svg";
import {
  neutral17,
  neutral33,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";

export const CreateShortPostButton: React.FC<{
  label: string;
  onPress?: () => void;
}> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <SVG source={penSVG} width={24} height={24} color={secondaryColor} />
      <View style={styles.textContainer}>
        <BrandText style={fontSemibold14}>{label}</BrandText>
      </View>
    </TouchableOpacity>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  selfCenter: {
    alignSelf: "center",
  },
  container: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral17,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 999,
    paddingLeft: layout.spacing_x1_5,
    paddingRight: layout.spacing_x2,
    height: 42,
  },
  textContainer: {
    marginLeft: layout.spacing_x1,
  },
});
