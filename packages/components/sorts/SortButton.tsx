import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import chevronUpSVG from "../../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../../assets/icons/chevron-up.svg";
import sortSVG from "../../../assets/icons/sort.svg";
import { neutral11 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

// TODO: Continue that (Props, dropdown menu, etc...)

export const SortButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <TertiaryBox
        mainContainerStyle={{
          borderColor: "#FFFFFF",
          paddingHorizontal: 13,
          flexDirection: "row",
          backgroundColor: neutral11,
        }}
        height={48}
      >
        <SVG
          source={sortSVG}
          height={16}
          width={16}
          style={{ marginRight: 8 }}
        />
        <BrandText style={fontSemibold14}>Price Descending</BrandText>
        <SVG
          source={isExpanded ? chevronUpSVG : chevronDownSVG}
          height={16}
          width={16}
          style={{ marginLeft: 8 }}
        />
      </TertiaryBox>
    </TouchableOpacity>
  );
};
