import React from "react";
import { TextInput, TextStyle } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";

import { neutral33 } from "@/utils/style/colors";

export const SearchInputRounded: React.FC<{
  handleChangeSearch?: (e: string) => void;
}> = ({ handleChangeSearch }) => {
  return (
    <PrimaryBox
      style={{
        padding: 10,
        width: 313,
        flexDirection: "row",
        alignItems: "center",
        borderColor: neutral33,
        height: 40,
      }}
    >
      <SVG
        style={{ marginRight: layout.spacing_x1 }}
        width={16}
        height={16}
        source={searchSVG}
      />
      <TextInput
        placeholder="Search..."
        onChangeText={handleChangeSearch}
        placeholderTextColor="#FFFFFF"
        style={[
          fontMedium14,
          {
            color: "#FFFFFF",
            width: "100%",
            outlineStyle: "none",
          } as TextStyle,
        ]}
      />
    </PrimaryBox>
  );
};
