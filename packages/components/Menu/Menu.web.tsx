import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";

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
  const [isMenuVisible, setMenuVisibility] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e: any) {
      if (menuRef && menuRef.current) {
        const ref: any = menuRef.current;
        if (!ref.contains(e.target)) {
          setMenuVisibility(false);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <View style={{ position: "relative", zIndex: 9999 }}>
      <TouchableOpacity
        onPress={() => setMenuVisibility((prev) => !prev)}
        activeOpacity={0.7}
      >
        {component}
      </TouchableOpacity>
      {isMenuVisible && (
        <div
          ref={menuRef as any}
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
        </div>
      )}
    </View>
  );
};
