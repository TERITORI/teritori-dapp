import React from "react";
import { View, TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { neutral33 } from "../../../utils/style/colors";

export interface NavDefinition {
  name: string;
}

export const NavBar = <T extends { [key: string]: NavDefinition }>({
  items,
  onSelect,
  selected,
}: {
  items: T;
  selected: keyof T;
  onSelect: (key: keyof T) => void;
}) => {
  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          marginTop: 15,
          borderWidth: 1,
          borderColor: neutral33,
          flexDirection: "row",
          borderRadius: 18,
          overflow: "hidden",
          alignSelf: "flex-start",
          height: 32,
          width: "100%",
        }}
      >
        {getKeys(items).map((key) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(key);
              }}
              style={{
                height: "100%",
                borderRightColor: neutral33,
                borderRightWidth: 1,
                flex: 1,
              }}
            >
              <View
                style={{
                  backgroundColor: selected === key ? "#16BBFF" : "black",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <BrandText
                  style={{
                    color: selected === key ? "black" : "white",
                    fontSize: 14,
                    paddingHorizontal: 12,
                    textAlign: "center",
                  }}
                >
                  {items[key].name}
                </BrandText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
