import React, { useRef } from "react";
import { StyleProp, TextInput, ViewStyle, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import searchSVG from "../../../assets/icons/search.svg";
import { selectSearchText, setSearchText } from "../../store/slices/search";
import { useAppDispatch } from "../../store/store";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SEARCH_BAR_INPUT_HEIGHT = 40;

export const SearchBarInputGlobal: React.FC<{
  onInteraction?: () => void;
  style?: StyleProp<ViewStyle>;
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
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
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
      style={style}
      noBrokenCorners={noBrokenCorners}
      mainContainerStyle={[
        {
          flexDirection: "row",
          paddingHorizontal: 12,
          backgroundColor: neutral17,
          width: fullWidth ? undefined : 250,
        },
        inputStyle,
      ]}
      fullWidth={fullWidth}
      height={SEARCH_BAR_INPUT_HEIGHT}
    >
      <SVG source={searchSVG} width={16} height={16} />
      <TextInput
        placeholder={placeholder}
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
