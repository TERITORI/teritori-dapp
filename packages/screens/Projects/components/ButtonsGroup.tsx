import React from "react";
import { View } from "react-native";

import { SimpleButton } from "@/components/buttons/SimpleButton";
import {
  neutral00,
  neutral33,
  primaryColor,
  secondaryColor,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

type ButtonsGroupType = {
  texts: string[];
  selectedId: number;
  onChange?: (selectedId: number) => void;
  size?: "XS" | "SM" | "M" | "XL";
};

export const ButtonsGroup: React.FC<ButtonsGroupType> = ({
  texts,
  selectedId,
  onChange,
  size = "M",
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: layout.spacing_x3,
      }}
    >
      {texts.map((text, btnId) => {
        return (
          <SimpleButton
            key={btnId}
            text={text}
            size={size}
            color={selectedId === btnId ? neutral00 : secondaryColor}
            bgColor={selectedId === btnId ? primaryColor : neutral33}
            style={[
              btnId === 0 && {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              btnId === 1 && {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            ]}
            onPress={() => onChange?.(btnId)}
          />
        );
      })}
    </View>
  );
};
