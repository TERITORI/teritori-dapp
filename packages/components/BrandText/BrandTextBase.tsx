import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import TextTicker from "react-native-text-ticker";
import { useSelector } from "react-redux";

import { selectIsLightTheme } from "../../store/slices/settings";

export const BrandTextBase: React.FC<TextProps & { isTicker?: boolean }> = (
  props
) => {
  const { style, isTicker, ...otherProps } = props;
  const styles = useStyles();

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

const useStyles = () => {
  const isLightTheme = useSelector(selectIsLightTheme);
  // eslint-disable-next-line no-restricted-syntax
  const styles = StyleSheet.create({
    base: {
      color: isLightTheme ? "black" : "white",
      fontSize: 20,
      fontWeight: "600",
    },
  });
  return styles;
};
