import React, { useState } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import chevronUpSVG from "../../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../../assets/icons/chevron-up.svg";
import filterSVG from "../../../assets/icons/filter.svg";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const FilterButton: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <TertiaryBox
        noBrokenCorners
        height={48}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: 6,
          padding: layout.padding_x1_5,
        }}
      >
        <SVG
          source={filterSVG}
          width={24}
          height={24}
          style={{ marginRight: layout.padding_x0_5 }}
        />
        <SVG
          source={isExpanded ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
        />
      </TertiaryBox>
    </TouchableOpacity>
  );
};
