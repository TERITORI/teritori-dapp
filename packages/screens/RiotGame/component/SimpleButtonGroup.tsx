import React, { useState } from "react";
import { View, ViewStyle } from "react-native";

import { SimpleButton } from "./SimpleButton";
import {
  neutral00,
  neutral33,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";

type ButtonItem = {
  text: string;
  onPress: (idx: number) => void;
};

type SimpleButtonGroupProps = {
  size?: "XS" | "SM" | "M" | "XL";
  style?: ViewStyle;
  buttons: ButtonItem[];
};

export const SimpleButtonGroup: React.FC<SimpleButtonGroupProps> = (props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const firstIdx = 0;
  const lastIdx = props.buttons.length - 1;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...props.style,
      }}
    >
      {props.buttons.map((button, idx) => {
        let borderStyle: ViewStyle = {
          borderWidth: 1,
          borderColor: neutral33,
        };
        switch (idx) {
          case firstIdx:
            borderStyle = {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              ...borderStyle,
            };
            break;
          case lastIdx:
            borderStyle = {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              ...borderStyle,
            };
            break;
          default:
            borderStyle = {
              borderRadius: 0,
              ...borderStyle,
            };
        }

        return (
          <SimpleButton
            text={button.text}
            size={props.size}
            color={idx === activeIdx ? neutral00 : secondaryColor}
            bgColor={idx === activeIdx ? yellowDefault : neutral33}
            style={borderStyle}
            onPress={() => {
              setActiveIdx(idx);
              button.onPress(idx);
            }}
          />
        );
      })}
    </View>
  );
};
