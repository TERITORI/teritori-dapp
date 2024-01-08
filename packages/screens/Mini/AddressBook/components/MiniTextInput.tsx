import React from "react";
import { TextInput, TextInputProps, TextStyle, StyleProp } from "react-native";

import { neutral22, neutral77 } from "../../../../utils/style/colors";
import { fontNormal15 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export interface MiniTexInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export default function MiniTextInput({ style, ...rest }: MiniTexInputProps) {
  return (
    <TextInput
      style={[
        {
          width: "100%",
          backgroundColor: neutral22,
          borderRadius: layout.borderRadius,
          padding: layout.spacing_x2,

          color: "#fff",
        },
        fontNormal15,
        style,
      ]}
      placeholderTextColor={neutral77}
      {...rest}
    />
  );
}
