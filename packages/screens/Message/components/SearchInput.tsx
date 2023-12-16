import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { secondaryColor, neutral33 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface SearchInputProps {
  onClose: () => void;
  value: string;
  setValue: (val: string) => void;
}

export const SearchInput = ({ onClose, value, setValue }: SearchInputProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: neutral33,
        borderRadius: 6,
        padding: 6,
        width: "100%",
      }}
    >
      <>
        <SVG source={searchSVG} width={20} height={20} />
        <SpacerRow size={1} />
        <TextInput
          placeholder="Search..."
          value={value}
          onChangeText={setValue}
          placeholderTextColor={secondaryColor}
          style={[
            fontMedium14,
            {
              color: "white",
              width: "100%",
            },
          ]}
        />
        <SpacerRow size={1} />
      </>
      <TouchableOpacity
        style={{ padding: layout.spacing_x0_25 }}
        onPress={onClose}
      >
        <SVG source={closeSVG} />
      </TouchableOpacity>
    </View>
  );
};
