// libraries
import React from "react";
import { TextProps } from "react-native";
import styled from "styled-components/native";

import { fontSemibold14 } from "../utils/style/fonts";

// components
import { BrandText } from "./BrandText";

// types
interface ErrorTextProps extends TextProps {
  center?: boolean;
}

// error text component to be used by input elements
export const ErrorText = ({ children, ...restProps }: ErrorTextProps) => {
  return children ? (
    <Text style={[fontSemibold14, restProps.style]} {...restProps}>
      {children}{" "}
    </Text>
  ) : null;
};

const Text = styled(BrandText)(({ theme: { colors } }) => ({
  marginTop: 6,
  color: colors.error,
}));
