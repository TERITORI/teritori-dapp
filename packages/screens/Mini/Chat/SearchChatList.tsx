import React from "react";
import { StyleProp, TextInput, View, ViewStyle } from "react-native";

import searchSVG from "../../../../assets/icons/search-gray.svg";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";

interface SearchInputProps {
  onClose: () => void;
  value: string;
  setValue: (val: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const SearchChatList = ({
  onClose,
  value,
  setValue,
  style,
}: SearchInputProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: neutral33,
          borderRadius: 6,
          padding: 6,
          width: "100%",
        },
        style,
      ]}
    >
      <>
        <SVG source={searchSVG} width={20} height={20} />
        <SpacerRow size={1} />
        <TextInput
          placeholder="Search..."
          value={value}
          onChangeText={setValue}
          placeholderTextColor={neutral77}
          style={[
            fontMedium16,
            {
              color: "#fff",
              width: "100%",
            },
          ]}
        />
      </>
    </View>
  );
};
