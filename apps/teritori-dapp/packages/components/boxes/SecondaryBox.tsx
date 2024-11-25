import React, { ReactNode } from "react";
import { StyleProp } from "react-native";

import { BoxStyle, Box } from "./Box";

// Simple box with no borders and notched corners

export const SecondaryBox: React.FC<{
  children?: ReactNode;
  style?: StyleProp<BoxStyle>;
}> = ({ style, children }) => {
  return (
    <Box notched style={style}>
      {children}
    </Box>
  );
};
