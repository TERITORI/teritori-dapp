import React, { useState } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import chevronUpSVG from "../../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../../assets/icons/chevron-up.svg";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { OutsideClickWrapper } from "../outsideClickWrapper";

export type DropdownOptionType = {
  label: string;
  key: string;
};

export interface DropdownProps {
  options: DropdownOptionType[];
  onChange: (value: string) => void;
  value: string;
  style?: ViewStyle;
  width?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  style,
  width,
}) => {
  const selectedOption =
    options.find((item) => item.key === value) || options[0];
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  return (
    <TertiaryBox
      style={style}
      width={width}
      mainContainerStyle={{
        backgroundColor: neutral33,
        zIndex: 9999,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setDropdownOpen((prev) => !prev)}
        style={{
          paddingVertical: 4,
          paddingHorizontal: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BrandText
          style={{
            fontSize: 12,
          }}
        >
          {selectedOption.label}
        </BrandText>
        <SVG
          source={isDropdownOpen ? chevronDownSVG : chevronUpSVG}
          height={16}
          width={16}
          style={{ marginLeft: 12 }}
        />
      </TouchableOpacity>
      {isDropdownOpen && (
        <OutsideClickWrapper onOutsideClick={() => setDropdownOpen(false)}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.9}
              onPress={() => {
                setDropdownOpen(false);
                onChange(option.key);
              }}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 8,
                borderTopWidth: 1,
                borderColor: neutral77,
                width: "100%",
              }}
            >
              <BrandText style={{ fontSize: 12 }}>{option.label}</BrandText>
            </TouchableOpacity>
          ))}
        </OutsideClickWrapper>
      )}
    </TertiaryBox>
  );
};
