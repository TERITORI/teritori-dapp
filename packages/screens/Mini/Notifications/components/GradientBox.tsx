import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, View, ViewStyle } from "react-native";

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
  style?: StyleProp<ViewStyle>;
};

export default function GradientBox({
  size,
  radius,
  direction = GradientDirectionEnum.topBottom,
  colors = [],
  style,
}: GradientBoxProps) {
  const startEnd = gradientPositionGenerator(direction);

  return (
    <View
      style={[
        {
          backgroundColor: primaryColor,
          width: size ?? 48,
          height: size ?? 48,
          borderRadius: radius ?? 6,
        },
        style,
      ]}
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

function gradientPositionGenerator(direction: GradientDirectionEnum) {
  const coordinates =
    direction === GradientDirectionEnum.topBottom
      ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
      : direction === GradientDirectionEnum.bottomTop
        ? { start: { x: 1, y: 1 }, end: { x: 1, y: 0 } }
        : direction === GradientDirectionEnum.leftDiagnol
          ? { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
          : direction === GradientDirectionEnum.rightDiagnol
            ? { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }
            : { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

  return coordinates;
}
