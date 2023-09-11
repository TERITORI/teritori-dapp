import React, { useRef } from "react";
import { View, TouchableOpacity } from "react-native";

import { useDropdowns } from "../../context/DropdownsProvider";
import { neutral33 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { MenuProps } from "./Menu";

const DEFAULT_WIDTH = 164;

export const Menu: React.FC<MenuProps> = ({
  items,
  component,
  width = DEFAULT_WIDTH,
}) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View style={{ position: "relative", zIndex: 9999 }}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(dropdownRef)}
        activeOpacity={0.7}
      >
        {component}
      </TouchableOpacity>
      {isDropdownOpen(dropdownRef) && (
        <View
          ref={dropdownRef}
          style={{
            zIndex: 99999,
            position: "absolute",
            right: 0,
            bottom: -20,
          }}
        >
          <PrimaryBox
            width={width}
            mainContainerStyle={{
              position: "absolute",
              paddingHorizontal: 12,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
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
