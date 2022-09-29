import { StyleSheet } from "react-native";

import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";
import { GradientTextProps } from "./GradientText";

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
}) => {
  const flatStyle = StyleSheet.flatten(style);

  return (
    <p
      style={{
        backgroundImage:
          "linear-gradient(90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: exoFontFamilyFromFontWeight(flatStyle?.fontWeight || "500"),
        fontSize: 16,
        margin: 0,
        ...flatStyle,
      }}
    >
      {children}
    </p>
  );
};
