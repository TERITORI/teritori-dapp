import React, { useRef } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "./../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../assets/icons/chevron-up.svg";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { Box } from "./boxes/Box";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { useDropdowns } from "../context/DropdownsProvider";
import {
  neutral17,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
interface SelectionDropdownProps {
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  dropdownOptions: string[];
  placeHolder?: string;
  setItem: (item: string) => void;
  item?: string;
  label?: string;
}

export const SelectionDropdown = ({
  dropdownOptions,
  placeHolder,
  item,
  label,
  setItem,
}: SelectionDropdownProps) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View
      style={{
        width: "100%",
        zIndex: 1,
        minHeight: 50,
        marginBottom: layout.spacing_x3,
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            marginRight: layout.spacing_x1,
            color: neutral77,
            marginBottom: layout.spacing_x1,
          },
        ]}
      >
        {label}
      </BrandText>

      <TertiaryBox
        style={[
          {
            width: "100%",
            minHeight: 50,
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
          activeOpacity={1}
          onPress={() => onPressDropdownButton(dropdownRef)}
        >
          <BrandText
            style={[
              fontSemibold14,
              { marginRight: layout.spacing_x1, color: neutral77 },
            ]}
          >
            {item ? item : placeHolder}
          </BrandText>
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </TertiaryBox>

      {isDropdownOpen(dropdownRef) && (
        <Box
          style={{
            position: "absolute",
            top: 80,
            right: 0,
            width: "100%",
            paddingHorizontal: layout.spacing_x1_5,
            paddingTop: layout.spacing_x1_5,
            backgroundColor: neutral33,
            alignItems: "flex-start",
          }}
        >
          {dropdownOptions.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                closeOpenedDropdown();
                setItem(item);
              }}
              key={index}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: layout.spacing_x1_5,
                },
              ]}
            >
              <BrandText
                style={[fontSemibold13, { marginLeft: 12, color: neutralA3 }]}
              >
                {item}
              </BrandText>
            </TouchableOpacity>
          ))}
        </Box>
      )}
    </View>
  );
};
