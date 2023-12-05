import { LinearGradientProps } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp } from "react-native";

import { GradientBoxStyle, GradientBox } from "./GradientBox";
import { useTheme } from "../../hooks/useTheme";

export const PrimaryBox: React.FC<{
  children: ReactNode;
  style?: StyleProp<GradientBoxStyle>;
}> = ({ children, style }) => {
  const theme = useTheme();
  const fillProps = { colors: [theme.backgroundColor, theme.backgroundColor] };
  return (
    <GradientBox
      borderProps={primaryBoxBorderProps}
      fillProps={fillProps}
      style={[{ borderWidth: 1, borderRadius: 8 }, style]}
    >
      {children}
    </GradientBox>
  );
};

const primaryBoxBorderProps: LinearGradientProps = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0.3 },
  locations: [-0.008, 1.0484],
  colors: ["#01B7C5", "#782C96"],
};
