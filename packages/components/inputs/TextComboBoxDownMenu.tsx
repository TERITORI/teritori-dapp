import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import { IMenuItem } from "./types";
import { primaryColor, secondaryColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText/BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TextComboBoxDownMenu: React.FC<{
  options: IMenuItem[];
  value?: string;
  onChange: (value: string) => void;
  hideMenu: () => void;
}> = ({ options = [], value = "", onChange, hideMenu }) => {
  const downmenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (downmenuRef && !downmenuRef.current?.contains(event.target)) {
        hideMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [downmenuRef, hideMenu]);
  return (
    <View
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        width: "100%",
        zIndex: 99,
      }}
      ref={downmenuRef}
    >
      <TertiaryBox
        style={{
          width: "100%",
          flexDirection: "column",
        }}
        mainContainerStyle={{ borderColor: secondaryColor }}
      >
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChange && onChange(item.value);
              }}
              style={{ flex: 1 }}
              key={index}
            >
              <BrandText
                style={{
                  color: value === item.value ? primaryColor : secondaryColor,
                }}
              >
                {item.label}
              </BrandText>
            </TouchableOpacity>
          );
        })}
      </TertiaryBox>
    </View>
  );
};
