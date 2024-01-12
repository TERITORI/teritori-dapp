import React from "react";
import { TextInput, View } from "react-native";

import {
  neutral22,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
};

export const Input = ({
  onChangeText,
  value,
  placeholder = "Enter ",
  secureTextEntry = false,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: layout.spacing_x2,
        backgroundColor: neutral22,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: layout.spacing_x2,
      }}
    >
      <TextInput
        style={[fontMedium16, { flex: 1, color: secondaryColor }]}
        value={value || ""}
        onChangeText={onChangeText}
        cursorColor={secondaryColor}
        placeholder={placeholder}
        placeholderTextColor={neutral77}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};
