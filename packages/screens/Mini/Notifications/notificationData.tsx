import { GradientDirectionEnum } from "../components/GradientBox";

import {
  blueDefault,
  orangeDefault,
  primaryColor,
  purpleDark,
  purpleDefault,
} from "@/utils/style/colors";

export const randomGradients = [
  {
    direction: GradientDirectionEnum.bottomTop,
    colors: [primaryColor, purpleDark],
  },
  {
    direction: GradientDirectionEnum.topBottom,
    colors: [primaryColor, purpleDefault, purpleDark],
  },
  {
    direction: GradientDirectionEnum.leftDiagnol,
    colors: [primaryColor, blueDefault],
  },
  {
    direction: GradientDirectionEnum.rightDiagnol,
    colors: [blueDefault, orangeDefault],
  },
];
