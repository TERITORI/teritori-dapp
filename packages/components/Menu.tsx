import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { neutral33 } from "../utils/style/colors";
import { BrandText } from "./BrandText";
import { PrimaryBox } from "./boxes/PrimaryBox";
import { OutsideClickWrapper } from "./outsideClickWrapper";

const DEFAULT_WIDTH = 164;

export interface MenuProps {
  component: React.ReactNode;
  items: {
    label: string;
    onPress: () => void;
  }[];

  width?: number;
}
export const Menu: React.FC<MenuProps> = ({
  items,
  component,
  width = DEFAULT_WIDTH,
}) => {
  const [isMenuVisible, setMenuVisibility] = useState(false);

  return (
    <View style={{ position: "relative", zIndex: 9999 }}>
      <TouchableOpacity
        onPress={() => setMenuVisibility((prev) => !prev)}
        activeOpacity={0.7}
      >
        {component}
      </TouchableOpacity>
      {isMenuVisible && (
        <OutsideClickWrapper
          onOutsideClick={() => setMenuVisibility(false)}
          style={{
            zIndex: 99999,
            position: "absolute",
            right: 0,
            bottom: -20,
          }}
        >
          <PrimaryBox
            width={width}
            style={{}}
            mainContainerStyle={{
              position: "absolute",
              paddingHorizontal: 12,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  setMenuVisibility(false);
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
                  style={{
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </BrandText>
              </TouchableOpacity>
            ))}
          </PrimaryBox>
        </OutsideClickWrapper>
      )}
    </View>
  );
};
