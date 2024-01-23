import React, { FC, Fragment, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import sortSVG from "../../../assets/icons/sort.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useDropdowns } from "../../hooks/useDropdowns";
import {
  marketplacePeriodItems,
  PeriodItem,
  selectTimePeriod,
  setTimePeriod,
} from "../../store/slices/marketplaceFilters";
import { useAppDispatch } from "../../store/store";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";

export const PeriodFilter: FC = () => {
  const { width } = useWindowDimensions();
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();

  const timePeriod = useSelector(selectTimePeriod);
  const [selectedItem, setSelectedItem] = useState<PeriodItem>(timePeriod);
  const dispatch = useAppDispatch();

  const onPressPeriodItem = (periodItem: PeriodItem) => {
    setSelectedItem(periodItem);
    dispatch(setTimePeriod(periodItem));
    setDropdownState(false);
  };

  return (
    <View ref={dropdownRef} collapsable={false}>
      <TouchableOpacity
        onPress={() => setDropdownState(!isDropdownOpen)}
        style={{
          height: 40,
          paddingLeft: layout.spacing_x1,
          paddingRight: layout.spacing_x1_5,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: neutral33,
        }}
      >
        <SVG source={sortSVG} width={16} height={16} />
        <SpacerRow size={1} />

        <BrandText style={fontSemibold14}>
          {width < RESPONSIVE_BREAKPOINT_S
            ? selectedItem.shortLabel
            : selectedItem.label}
        </BrandText>
        <SpacerRow size={1} />

        <SVG
          source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View
          style={{
            position: "absolute",
            top: 44,
            backgroundColor: neutral33,
            paddingHorizontal: layout.spacing_x1_5,
            paddingTop: layout.spacing_x1_5,
            borderRadius: 8,
            width: "100%",
          }}
        >
          {marketplacePeriodItems
            .filter((periodItem) => selectedItem !== periodItem)
            .map((periodItem, index) => (
              <Fragment key={index}>
                <TouchableOpacity onPress={() => onPressPeriodItem(periodItem)}>
                  <BrandText style={fontSemibold14}>
                    {width < RESPONSIVE_BREAKPOINT_S
                      ? periodItem.shortLabel
                      : periodItem.label}
                  </BrandText>
                </TouchableOpacity>
                <SpacerColumn size={1.5} />
              </Fragment>
            ))}
        </View>
      )}
    </View>
  );
};
