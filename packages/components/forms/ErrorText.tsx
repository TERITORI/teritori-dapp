// libraries
import React from "react";
import { TextProps } from "react-native";

import { errorColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

interface ErrorTextProps extends TextProps {
  center?: boolean;
}

// error text component to be used by input elements
export const ErrorText: React.FC<ErrorTextProps> = ({
  children,
  ...restProps
}) => {
  return children ? (
    <BrandText
      style={[
        {
          marginTop: 6,
          color: errorColor,
        },
        fontSemibold14,
        restProps.style,
      ]}
      {...restProps}
    >
      {children}
    </BrandText>
  ) : null;
};
