import React, { ReactNode } from "react";
import { StyleProp } from "react-native";

import { BoxStyle, Box } from "./Box";
import { neutral33 } from "../../utils/style/colors";

// Box with notched corners and a border

export const TertiaryBox: React.FC<{
  children?: ReactNode;
  style?: StyleProp<BoxStyle>;
}> = ({ style, children }) => {
  return (
    <Box
      notched
      style={[
        {
          borderWidth: 1,
          borderColor: neutral33,
        },
        style,
      ]}
    >
      {children}
    </Box>
  );
};
