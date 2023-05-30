import { StyleProp, TextStyle } from "react-native";

export const exoFontFamilyFromFontWeight = (weight: string | undefined) => {
  switch (weight) {
    case "500":
      return "Exo_500Medium";
    case "700":
      return "Exo_700Bold";
    default:
      return "Exo_600SemiBold";
  }
};

export const fontBold16: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: -(16 * 0.01),
  lineHeight: 22,
  fontFamily: "Exo_700Bold",
  fontWeight: "700",
};
export const fontBold12: StyleProp<TextStyle> = {
  fontSize: 12,
  letterSpacing: 12 * 0.08,
  lineHeight: 16,
  fontFamily: "Exo_700Bold",
  fontWeight: "700",
};
export const fontBold11: StyleProp<TextStyle> = {
  fontSize: 11,
  letterSpacing: -(12 * 0.04),
  lineHeight: 14,
  fontFamily: "Exo_700Bold",
  fontWeight: "700",
};
export const fontBold9: StyleProp<TextStyle> = {
  fontSize: 9,
  letterSpacing: 9 * 0.08,
  lineHeight: 12,
  fontFamily: "Exo_700Bold",
  fontWeight: "700",
};

export const fontSemibold28: StyleProp<TextStyle> = {
  fontSize: 28,
  letterSpacing: -(28 * 0.04),
  lineHeight: 32,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold24: StyleProp<TextStyle> = {
  fontSize: 24,
  letterSpacing: -(24 * 0.04),
  lineHeight: 28,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold20: StyleProp<TextStyle> = {
  fontSize: 20,
  letterSpacing: -(20 * 0.04),
  lineHeight: 24,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold16: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 20,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold15: StyleProp<TextStyle> = {
  fontSize: 15,
  letterSpacing: 0,
  lineHeight: 18,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold14: TextStyle = {
  fontSize: 14,
  letterSpacing: 0,
  lineHeight: 20,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold13: StyleProp<TextStyle> = {
  fontSize: 13,
  letterSpacing: 0,
  lineHeight: 18,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold12: StyleProp<TextStyle> = {
  fontSize: 12,
  letterSpacing: -(12 * 0.04),
  lineHeight: 16,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold11: StyleProp<TextStyle> = {
  fontSize: 11,
  letterSpacing: -(10 * 0.02),
  lineHeight: 15,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};
export const fontSemibold9: StyleProp<TextStyle> = {
  fontSize: 9,
  lineHeight: 12,
  fontFamily: "Exo_600SemiBold",
  fontWeight: "600",
};

export const fontMedium48: StyleProp<TextStyle> = {
  fontSize: 48,
  letterSpacing: -(48 * 0.03),
  lineHeight: 64,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium40: StyleProp<TextStyle> = {
  fontSize: 40,
  letterSpacing: -(40 * 0.02),
  lineHeight: 32,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium32: StyleProp<TextStyle> = {
  fontSize: 32,
  letterSpacing: -(32 * 0.02),
  lineHeight: 44,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium24: StyleProp<TextStyle> = {
  fontSize: 24,
  letterSpacing: -(24 * 0.02),
  lineHeight: 34,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium16: StyleProp<TextStyle> = {
  fontSize: 16,
  letterSpacing: -(16 * 0.04),
  lineHeight: 18,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium14: StyleProp<TextStyle> = {
  fontSize: 14,
  letterSpacing: -(14 * 0.04),
  lineHeight: 16,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium13: StyleProp<TextStyle> = {
  fontSize: 13,
  letterSpacing: -(13 * 0.02),
  lineHeight: 18,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
export const fontMedium10: StyleProp<TextStyle> = {
  fontSize: 10,
  letterSpacing: -(10 * 0.04),
  lineHeight: 12,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
