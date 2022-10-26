import React, { useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronUpSVG from "../../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../../assets/icons/chevron-up.svg";
import sortSVG from "../../../assets/icons/sort.svg";
import { neutral11, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SortButton: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handlePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <TertiaryBox
        fullWidth
        mainContainerStyle={{
          borderColor: "#FFFFFF",
          paddingHorizontal: 13,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: neutral11,
        }}
        height={48}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={sortSVG}
            height={16}
            width={16}
            style={{ marginRight: 8 }}
          />
          <BrandText style={fontSemibold14}>Price Descending</BrandText>
        </View>

        <SVG
          source={isExpanded ? chevronUpSVG : chevronDownSVG}
          height={16}
          width={16}
          style={{ marginLeft: 8 }}
          color={secondaryColor}
        />
      </TertiaryBox>
    </TouchableOpacity>
  );
};
