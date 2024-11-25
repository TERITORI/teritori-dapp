import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import TextTicker from "react-native-text-ticker";

import { useTheme } from "../../hooks/useTheme";

export const BrandTextBase: React.FC<TextProps & { isTicker?: boolean }> = (
  props,
) => {
  const { style, isTicker, ...otherProps } = props;
  const theme = useTheme();
  const baseStyle: TextStyle = {
    color: theme.textColor,
    fontSize: 20,
    fontWeight: "600",
  };

  if (isTicker)
    return (
      <TextTicker
        style={[baseStyle, style]}
        duration={4000}
        loop
        repeatSpacer={16}
        marqueeDelay={1000}
        {...otherProps}
      />
    );
  else
    return (
      <Text style={[baseStyle, style]} {...otherProps}>
        {props.children}
      </Text>
    );
};
