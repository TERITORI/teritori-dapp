import { TextStyle } from "react-native";

import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";

export const GradientText: React.FC<{
  style: Pick<TextStyle, "fontFamily" | "fontWeight" | "fontSize">;
}> = ({ children, style }) => (
  <p
    style={{
      backgroundImage:
        "linear-gradient(90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontFamily: exoFontFamilyFromFontWeight("500"),
      fontSize: 16,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);
