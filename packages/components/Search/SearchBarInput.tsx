import React, { useRef } from "react";
import { StyleProp, TextInput, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import searchSVG from "../../../assets/icons/search.svg";
import { selectSearchText, setSearchText } from "../../store/slices/search";
import { useAppDispatch } from "../../store/store";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SEARCH_BAR_INPUT_HEIGHT = 40;

export const SearchBarInputGlobal: React.FC<{
  onInteraction?: () => void;
  style?: StyleProp<BoxStyle>;
}> = (props) => {
  const text = useSelector(selectSearchText);
  const dispatch = useAppDispatch();
  return (
    <SearchBarInput
      {...props}
      text={text}
      onChangeText={(text) => dispatch(setSearchText(text))}
    />
  );
};

export const SearchBarInput: React.FC<{
  text: string;
  onChangeText: (text: string) => void;
  onInteraction?: () => void;
  style?: StyleProp<BoxStyle>;
}> = ({ onInteraction, text, onChangeText, style }) => {
  const ref = useRef<TextInput>(null);
  const fullWidth = StyleSheet.flatten(style)?.width === "100%";
  return (
    <TertiaryBox
      style={[
        {
          flexDirection: "row",
          paddingHorizontal: 12,
          backgroundColor: neutral17,
          width: fullWidth ? "100%" : 250,
          height: SEARCH_BAR_INPUT_HEIGHT,
          alignItems: "center",
        },
        style,
      ]}
    >
      <SVG source={searchSVG} width={16} height={16} />
      <TextInput
        value={text}
        ref={ref}
        style={[
          fontSemibold14,
          {
            color: "white",
            flex: 1,
            marginLeft: 8,
          },
          { outlineStyle: "none" } as any,
        ]}
        onChangeText={(text) => {
          onChangeText(text);
          onInteraction?.();
          setTimeout(() => ref.current?.focus(), 10); // restore focus in case it got lost in previous side-effects, this happens in firefox
        }}
        onFocus={() => {
          onInteraction?.();
        }}
      />
    </TertiaryBox>
  );
};
