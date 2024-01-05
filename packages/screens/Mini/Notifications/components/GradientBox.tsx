import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { primaryColor, secondaryColor } from "../../../../utils/style/colors";

export enum GradientDirectionEnum {
  "topBottom",
  "bottomTop",
  "leftDiagnol",
  "rightDiagnol",
}

type GradientBoxProps = {
  size?: number;
  radius?: number;
  direction?: GradientDirectionEnum;
  colors: string[];
};

export default function GradientBox({
  size,
  radius,
  direction = GradientDirectionEnum.topBottom,
  colors = [],
}: GradientBoxProps) {
  const startEnd =
    direction === GradientDirectionEnum.topBottom
      ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
      : direction === GradientDirectionEnum.bottomTop
        ? { start: { x: 1, y: 1 }, end: { x: 1, y: 0 } }
        : direction === GradientDirectionEnum.leftDiagnol
          ? { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
          : direction === GradientDirectionEnum.rightDiagnol
            ? { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }
            : { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

  return (
    <View
      style={{
        backgroundColor: primaryColor,
        width: size ?? 48,
        height: size ?? 48,
        borderRadius: radius ?? 6,
      }}
    >
      <LinearGradient
        start={startEnd.start}
        end={startEnd.end}
        colors={colors.length ? colors : [primaryColor, secondaryColor]}
        style={{ flex: 1, borderRadius: radius ?? 6 }}
      />
    </View>
  );
}
