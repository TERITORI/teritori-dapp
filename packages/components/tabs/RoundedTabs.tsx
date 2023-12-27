import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import {
  neutral00,
  neutral39,
  secondaryColor,
  transparentColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { objectKeys } from "../../utils/typescript";
import { BrandText } from "../BrandText";

export interface TabDefinition {
  name: string;
}

export const RoundedTabs = <T extends { [key: string]: TabDefinition }>({
  items,
  onSelect,
  style,
  selected,
}: {
  items: T;
  selected: keyof T;
  onSelect: (key: keyof T, def: TabDefinition) => void;

  style?: StyleProp<ViewStyle>;
}) => {
  const itemsKeys = objectKeys(items);

  return (
    <>
      <View
        style={[
          {
            borderRadius: 50,
            borderColor: neutral39,
            borderWidth: 1,
            flex: 1,
            flexDirection: "row",
            padding: layout.spacing_x0_25,
          },
          style,
        ]}
      >
        {itemsKeys.map((key, index) => {
          const item = items[key];
          const isSelected = selected === key;
          return (
            <TouchableOpacity
              key={`${item.name}-${index}`}
              activeOpacity={0.9}
              style={{
                backgroundColor: isSelected ? secondaryColor : transparentColor,
                flex: 1,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => onSelect(key, item)}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: isSelected ? neutral00 : secondaryColor,
                  },
                ]}
              >
                {item.name}
              </BrandText>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
