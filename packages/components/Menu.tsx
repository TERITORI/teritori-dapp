import React from "react";
import { View, TouchableOpacity } from "react-native";

import { BrandText } from "./BrandText";
import { PrimaryBox } from "./boxes/PrimaryBox";

import { useDropdowns } from "@/hooks/useDropdowns";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const DEFAULT_WIDTH = 164;

interface MenuProps {
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
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity onPress={() => setDropdownState(!isDropdownOpen)}>
        {component}
      </TouchableOpacity>
      {isDropdownOpen && (
        <View ref={dropdownRef} collapsable={false}>
          <PrimaryBox
            style={{
              position: "absolute",
              right: 0,
              bottom: -20,
              width,
              paddingHorizontal: layout.spacing_x1_5,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                disabled={item.disabled}
                key={item.label}
                onPress={() => {
                  setDropdownState(false);
                  item.onPress();
                }}
                activeOpacity={0.7}
                style={[
                  { paddingVertical: layout.spacing_x1_5, width: "100%" },
                  index !== items.length - 1 && {
                    borderBottomWidth: 1,
                    borderColor: neutral33,
                  },
                ]}
              >
                <BrandText
                  style={[fontSemibold13, item.disabled && { opacity: 0.5 }]}
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
