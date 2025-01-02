import { TextStyle } from "react-native";

import { neutral77 } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const sectionLabelCStyle: TextStyle = {
  ...fontSemibold28,
  textAlign: "center",
  marginBottom: layout.spacing_x1_5,
};

export const gameBoxLabelCStyle: TextStyle = {
  ...fontSemibold12,
  color: neutral77,
  textAlign: "center",
};
