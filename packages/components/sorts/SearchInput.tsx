import React from "react";
import { StyleProp, StyleSheet, TextInput, ViewStyle } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

export const SearchInput: React.FC<{
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  handleChangeText?: (e: string) => void;
}> = ({ handleChangeText, borderRadius, style }) => {
  return (
    <LegacyTertiaryBox
      style={style}
      height={40}
      mainContainerStyle={{
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderRadius,
      }}
      fullWidth
    >
      <SVG
        style={{ marginRight: layout.spacing_x1, maxWidth: 22 }}
        source={searchSVG}
      />
      <TextInput
        placeholder="Search..."
        onChangeText={handleChangeText}
        placeholderTextColor="#FFFFFF"
        style={textInputStyle}
      />
    </LegacyTertiaryBox>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  textInput: {
    color: "#FFFFFF",
    width: "100%",
    outlineStyle: "none",
  },
});
const textInputStyle = StyleSheet.flatten([styles.textInput, fontMedium14]);
