import React, { ReactNode } from "react";
import { StyleProp } from "react-native";

import { BoxStyle, Box } from "./Box";
import { neutral33 } from "../../utils/style/colors";

export const TertiaryBox: React.FC<{
  style?: StyleProp<BoxStyle>;
  children?: ReactNode;
  notched?: boolean;
}> = ({ style, children, notched }) => {
  return (
    <Box
      style={[
        {
          borderColor: neutral33,
          borderWidth: 1,
        },
        style,
      ]}
      notched={notched}
    >
      {children}
    </Box>
  );
};
