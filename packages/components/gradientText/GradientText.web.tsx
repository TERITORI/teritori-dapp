import { StyleSheet } from "react-native";

import { exoFontFamilyFromFontWeight } from "../../utils/style/fonts";
import { GradientTextProps } from "./GradientText";

export const GradientText: React.FC<GradientTextProps> = ({
  gradient,
  children,
  style,
  ...props
}) => {
  const flatStyle = style ? StyleSheet.flatten(style) : undefined;
  const fontSize = 20;

  const lineHeight = `${
    flatStyle?.lineHeight || flatStyle?.fontSize || fontSize
  }px`;
  if (flatStyle) delete flatStyle.lineHeight;

  const textOverflow =
    props.ellipsizeMode === "tail" && props.numberOfLines === 1
      ? "ellipsis"
      : "unset";
  const overflow =
    props.ellipsizeMode === "tail" && props.numberOfLines === 1
      ? "hidden"
      : "unset";

  return (
    <span
      style={{
        margin: 0,
        background: `linear-gradient(${gradient})`,
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
