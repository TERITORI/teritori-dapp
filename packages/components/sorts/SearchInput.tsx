import React from "react";
import { StyleProp, StyleSheet, TextInput } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { neutral44 } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { Box, BoxStyle } from "../boxes/Box";

export const SearchInput: React.FC<{
  style?: StyleProp<BoxStyle>;
  borderRadius?: number;
  handleChangeText?: (e: string) => void;
}> = ({ handleChangeText, borderRadius, style }) => {
  return (
    <Box
      style={[
        {
          height: 40,
          width: "100%",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          borderRadius,
          borderColor: neutral44,
          borderWidth: 1,
        },
        style,
      ]}
      notched
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
    </Box>
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
