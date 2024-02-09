import React from "react";
import { TouchableOpacity } from "react-native";

import { PaginationBlockProps } from "./PaginationProps.type";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const PaginationBlock = ({ source, onPress }: PaginationBlockProps) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <TertiaryBox
        style={{
          height: 42,
          width: 56,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVG source={source} height={16} width={16} />
      </TertiaryBox>
    </TouchableOpacity>
  );
};
