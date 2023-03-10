import React, { useState } from "react";
import { View, ViewStyle } from "react-native";

import {
  neutral00,
  neutral22,
  neutral33,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { SimpleButton } from "./SimpleButton";

type SimpleButtonGroupProps = {
  containerStyle?: ViewStyle;
  size?: "XS" | "SM" | "M" | "XL";
  buttons: {
    text: string;
    onPress?(): void;
  }[];
};

export const SimpleButtonGroup: React.FC<SimpleButtonGroupProps> = ({
  containerStyle,
  size = "M",
  buttons,
}) => {
  const [activeButton, setActiveButton] = useState(0);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...containerStyle,
      }}
    >
      {buttons.map((btn, idx) => {
        const color = idx === activeButton ? neutral00 : secondaryColor;
        const bgColor = idx === activeButton ? yellowDefault : neutral22;
        const borderRadius = layout.padding_x1_5;

        return (
          <SimpleButton
            text={btn.text}
            size={size}
            color={color}
            bgColor={bgColor}
            style={[
              {
                borderRadius: 0,
                borderWidth: 1,
                borderRightWidth: 0,
                borderColor: neutral33,
              },
              idx === buttons.length - 1 && {
                borderTopRightRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                borderRightWidth: 1,
              },
              idx === 0 && {
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
              },
            ]}
            onPress={() => {
              setActiveButton(idx);
              btn.onPress?.();
            }}
          />
        );
      })}
    </View>
  );
};
