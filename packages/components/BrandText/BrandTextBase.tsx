import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import TextTicker from "react-native-text-ticker";

export const BrandTextBase: React.FC<TextProps & { isTicker?: boolean }> = (
  props
) => {
  const { style, isTicker, ...otherProps } = props;

  if (isTicker)
    return (
      <TextTicker
        style={[styles.base, style]}
        duration={4000}
        loop
        repeatSpacer={16}
        marqueeDelay={1000}
        {...otherProps}
      />
    );
  else
    return (
      <Text style={[styles.base, style]} {...otherProps}>
        {props.children}
      </Text>
    );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  base: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});
