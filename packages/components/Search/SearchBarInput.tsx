import React, { useRef } from "react";
import { StyleProp, TextInput, StyleSheet, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { selectSearchText, setSearchText } from "../../store/slices/search";
import { useAppDispatch } from "../../store/store";
import { neutral17, neutral77 } from "../../utils/style/colors";
import { fontRegular12 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";

import searchSVG from "@/assets/icons/search.svg";

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
      placeholder="Search..."
      style={{ width: "100%" }}
    />
  );
};

export const SearchBarInput: React.FC<{
  text: string;
  onChangeText: (text: string) => void;
  onInteraction?: () => void;
  placeholder?: string;
  style?: StyleProp<BoxStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  noBrokenCorners?: boolean;
}> = ({
  onInteraction,
  text,
  onChangeText,
  style,
  placeholder,
  inputStyle,
  noBrokenCorners = false,
}) => {
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
      <SVG source={searchSVG} width={20} height={20} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={neutral77}
        value={text}
        ref={ref}
        style={[
          fontRegular12,
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
