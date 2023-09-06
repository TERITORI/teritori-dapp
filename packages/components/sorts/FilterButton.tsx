import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import chevronUpSVG from "../../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../../assets/icons/chevron-up.svg";
import filterSVG from "../../../assets/icons/filter.svg";
import {
  selectShowFilters,
  setShowFilters,
} from "../../store/slices/marketplaceFilters";
import { useAppDispatch } from "../../store/store";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const FilterButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  showChevron?: boolean;
}> = ({ style, mainContainerStyle, showChevron = false }) => {
  const dispatch = useAppDispatch();
  const isExpanded = useSelector(selectShowFilters);
  const handlePress = () => {
    dispatch(setShowFilters(!isExpanded));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      <TertiaryBox
        noBrokenCorners
        height={48}
        width={showChevron ? undefined : 48}
        mainContainerStyle={[
          {
            flexDirection: "row",
            borderRadius: 6,
          },
          mainContainerStyle,
        ]}
      >
        <SVG source={filterSVG} width={20} height={20} />
        {showChevron && (
          <SVG
            style={{ marginLeft: layout.spacing_x0_5 }}
            source={isExpanded ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        )}
      </TertiaryBox>
    </TouchableOpacity>
  );
};
