import React from "react";
import { Text, TextProps } from "react-native";

import { useContentContext } from "../../context/ContentProvider";

export const Label: React.FC<TextProps & { styleType: string }> = ({
  style,
  styleType = "base",
  children,
  ...otherProps
}) => {
  const contentContext = useContentContext();
  return (
    <Text style={[contentContext.styles[styleType], style]} {...otherProps}>
      {children}
    </Text>
  );
};
