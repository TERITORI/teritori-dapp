import React from "react";
import { StyleProp, StyleSheet, TextInput, ViewStyle } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SearchInput: React.FC<{
  style?: StyleProp<ViewStyle>;
  handleChangeText: (e: string) => void;
}> = (props) => {
  return (
    <TertiaryBox
      style={props.style}
      height={48}
      mainContainerStyle={{
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
      fullWidth
    >
      <SVG
        style={{ marginRight: layout.padding_x1, maxWidth: 22 }}
        source={searchSVG}
      />
      <TextInput
        placeholder="Search..."
        onChangeText={props.handleChangeText}
        placeholderTextColor="#FFFFFF"
        style={textInputStyle}
      />
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: "#FFFFFF",
    width: "100%",
    outlineStyle: "none",
  },
});
const textInputStyle = StyleSheet.flatten([styles.textInput, fontMedium14]);
