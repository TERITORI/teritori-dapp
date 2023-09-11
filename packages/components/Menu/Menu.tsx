import React, { useRef } from "react";
import { View, TouchableOpacity } from "react-native";

import { useDropdowns } from "../../context/DropdownsProvider";
import { neutral33 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { PrimaryBox } from "../boxes/PrimaryBox";

const DEFAULT_WIDTH = 164;

export interface MenuProps {
  component: React.ReactNode;
  items: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  }[];

  width?: number;
}
export const Menu: React.FC<MenuProps> = ({
  items,
  component,
  width = DEFAULT_WIDTH,
}) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        {component}
      </TouchableOpacity>
      {isDropdownOpen(dropdownRef) && (
        <View ref={dropdownRef}>
          <PrimaryBox
            width={width}
            style={{ position: "absolute", right: 0, bottom: -20 }}
            mainContainerStyle={{
              position: "absolute",
              paddingHorizontal: 12,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                disabled={item.disabled}
                key={item.label}
                onPress={() => {
                  closeOpenedDropdown();
                  item.onPress();
                }}
                activeOpacity={0.7}
                style={[
                  { paddingVertical: 12, width: "100%" },
                  index !== items.length - 1 && {
                    borderBottomWidth: 1,
                    borderColor: neutral33,
                  },
                ]}
              >
                <BrandText
                  style={[
                    {
                      fontSize: 13,
                    },
                    item.disabled && { opacity: 0.5 },
                  ]}
                >
                  {item.label}
                </BrandText>
              </TouchableOpacity>
            ))}
          </PrimaryBox>
        </View>
      )}
    </View>
  );
};
