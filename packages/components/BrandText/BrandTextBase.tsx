import React from "react";
import { Text, TextProps } from "react-native";

export const BrandTextBase: React.FC<TextProps> = (props) => {
  const { style, onPress, ...otherProps } = props;
  return (
    <Text
      style={[
        {
          color: "white",
          fontSize: 20,
          fontWeight: "600",
        },
        style,
      ]}
      {...otherProps}
    >
      {props.children}
    </Text>
  );
};
