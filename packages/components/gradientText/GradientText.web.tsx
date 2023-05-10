import { StyleSheet } from "react-native";

import { GradientTextProps, GradientType } from "./GradientText";
import {
  gradientColorBlue,
  gradientColorDarkBlue,
  gradientColorDarkerBlue,
  gradientColorGray,
  gradientColorLavender,
  gradientColorLightBlue,
  gradientColorLighterGray,
  gradientColorLightGray,
  gradientColorLightLavender,
  gradientColorPink,
  gradientColorPurple,
  gradientColorSalmon,
  gradientColorTurquoise,
} from "../../utils/style/colors";
import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";

const gradient = (type: GradientType) => {
  switch (type) {
    case "blue":
      return `90deg, ${gradientColorLightBlue} 0%, ${gradientColorDarkBlue} 100%`;
    case "blueReversed":
      return `90deg, ${gradientColorDarkBlue} 0%, ${gradientColorLightBlue} 100%`;
    case "blueExtended":
      return `90deg, ${gradientColorDarkerBlue} 0%, ${gradientColorBlue} 50%, ${gradientColorTurquoise} 100%`;
    case "purple":
      return `267deg, ${gradientColorLavender} 0%, ${gradientColorPurple} 100%`;
    case "pink":
      return `90deg, ${gradientColorSalmon} 0%, ${gradientColorPink} 100%`;
    case "gray":
      return `90deg, ${gradientColorGray} 0%, ${gradientColorLightGray} 100%`;
    case "grayLight":
      return `90deg, ${gradientColorLighterGray} 0%, ${gradientColorLightLavender} 100%`;
  }
};

export const GradientText: React.FC<GradientTextProps> = ({
  gradientType,
  children,
  style,
  ...props
}) => {
  const flatStyle = style ? { ...StyleSheet.flatten(style) } : undefined;
  const fontSize = 20;

  const lineHeight = `${
    flatStyle?.lineHeight || flatStyle?.fontSize || fontSize
  }px`;

  if (flatStyle) delete flatStyle.lineHeight;

  const textOverflow =
    (props.ellipsizeMode === "tail" || props.ellipsizeMode === "middle") &&
    props.numberOfLines === 1
      ? "ellipsis"
      : "unset";
  const overflow =
    (props.ellipsizeMode === "tail" || props.ellipsizeMode === "middle") &&
    props.numberOfLines === 1
      ? "hidden"
      : "unset";

  return (
    <span
      style={{
        margin: 0,
        background: `linear-gradient(${gradient(gradientType)})`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "white",
        fontFamily: exoFontFamilyFromFontWeight(flatStyle?.fontWeight),
        width: "fit-content",
        fontSize,
        lineHeight,
        textOverflow,
        overflow,
        ...flatStyle,
      }}
    >
      {children}
    </span>
  );
};
