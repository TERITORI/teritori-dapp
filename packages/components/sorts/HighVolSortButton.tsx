import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import sortSVG from "../../../assets/icons/sort.svg";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { neutral11, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const HighVolSortButton: React.FC<{
  sortDirection: SortDirection;
  onChangeSortDirection: (val: SortDirection) => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ style, sortDirection, onChangeSortDirection, height = 48 }) => {
  const handlePress = () => {
    if (sortDirection === SortDirection.SORT_DIRECTION_DESCENDING) {
      onChangeSortDirection(SortDirection.SORT_DIRECTION_ASCENDING);
    } else {
      onChangeSortDirection(SortDirection.SORT_DIRECTION_DESCENDING);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <SecondaryBox
        style={{
          borderWidth: 1,
          borderColor: "#FFFFFF",
          paddingHorizontal: layout.spacing_x1_5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: neutral11,
          height,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={sortSVG}
            height={16}
            width={16}
            style={{ marginRight: layout.spacing_x0_75 }}
          />
          <BrandText style={fontSemibold14}>
            {sortDirection === SortDirection.SORT_DIRECTION_ASCENDING
              ? "Highest "
              : "Lowest "}
            Total Vol
          </BrandText>
        </View>
        <SVG
          source={
            sortDirection === SortDirection.SORT_DIRECTION_ASCENDING
              ? chevronUpSVG
              : chevronDownSVG
          }
          height={16}
          width={16}
          style={{ marginLeft: layout.spacing_x0_5 }}
          color={secondaryColor}
        />
      </SecondaryBox>
    </TouchableOpacity>
  );
};
