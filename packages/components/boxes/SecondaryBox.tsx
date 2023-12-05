import React, { ReactNode } from "react";
import { StyleProp } from "react-native";

import { BoxStyle, Box } from "./Box";

export const SecondaryBox: React.FC<{
  style?: StyleProp<BoxStyle>;
  children?: ReactNode;
  notched?: boolean;
}> = ({ style, children, notched }) => {
  return (
    <Box style={[style]} notched={notched}>
      {children}
    </Box>
  );
};
