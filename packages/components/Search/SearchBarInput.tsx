import React, { useRef } from "react";
import { StyleProp, TextInput, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import searchSVG from "../../../assets/icons/search.svg";
import { selectSearchText, setSearchText } from "../../store/slices/search";
import { useAppDispatch } from "../../store/store";
import { neutral17 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SEARCH_BAR_INPUT_HEIGHT = 40;

export const SearchBarInput: React.FC<{
  onInteraction?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onInteraction, style }) => {
  const text = useSelector(selectSearchText);
  const ref = useRef<TextInput>(null);
  const dispatch = useAppDispatch();
  return (
    <TertiaryBox
      style={style}
      mainContainerStyle={{
        flexDirection: "row",
        paddingHorizontal: 12,
        backgroundColor: neutral17,
        width: 250,
      }}
      height={SEARCH_BAR_INPUT_HEIGHT}
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
          dispatch(setSearchText(text));
          onInteraction && onInteraction();
          setTimeout(() => ref.current?.focus(), 10); // restore focus in case it got lost in previous side-effects, this happens in firefox
        }}
        onFocus={() => {
          onInteraction && onInteraction();
        }}
      />
    </TertiaryBox>
  );
};
