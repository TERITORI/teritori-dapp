import React, { FC, Fragment, useRef, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import sortSVG from "../../../assets/icons/sort.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useDropdowns } from "../../context/DropdownsProvider";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";

interface PeriodItem {
  label: string;
  shortLabel: string;
}

const marketplacePeriodItems: PeriodItem[] = [
  {
    label: "Last 10 minutes",
    shortLabel: "10m",
  },
  {
    label: "Last 1 hour",
    shortLabel: "1h",
  },
  {
    label: "Last 6 hours",
    shortLabel: "6h",
  },
  {
    label: "Last 1 day",
    shortLabel: "1d",
  },
  {
    label: "Last 7 days",
    shortLabel: "7d",
  },
  {
    label: "Last 30 days",
    shortLabel: "30d",
  },
];

export const PeriodFilter: FC = () => {
  const { width } = useWindowDimensions();
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const [selectedItem, setSelectedItem] = useState<PeriodItem>(
    marketplacePeriodItems[3],
  );

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(dropdownRef)}
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
          source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
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
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(periodItem);
                    closeOpenedDropdown();
                  }}
                >
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
