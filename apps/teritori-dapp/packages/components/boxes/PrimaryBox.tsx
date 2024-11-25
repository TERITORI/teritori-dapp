import { ReactNode } from "react";
import { StyleProp } from "react-native";

import { BoxStyle, Box, GradientParams } from "./Box";

// Default gradient borders box

export const PrimaryBox: React.FC<{
  children: ReactNode;
  style?: StyleProp<BoxStyle>;
}> = ({ children, style }) => {
  return (
    <Box borderGradient={borderGradient} style={[{ borderWidth: 1 }, style]}>
      {children}
    </Box>
  );
};

const borderGradient: GradientParams = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0.3 },
  locations: [-0.008, 1.0484],
  colors: ["#01B7C5", "#782C96"],
};
