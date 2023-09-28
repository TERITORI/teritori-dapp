import { TextStyle, useWindowDimensions, ViewStyle } from "react-native";

import {
  neutral00,
  neutral17,
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const MOBILE_WIDTH = 768;

export const useCommonStyles = () => {
  const { width } = useWindowDimensions();

  const switchBox: ViewStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    margin: layout.spacing_x1,
  };
  const bigTitle: TextStyle = {
    ...fontSemibold20,

    paddingTop: layout.spacing_x4,
    paddingLeft: layout.spacing_x2,
  };
  const cardSubtitle: TextStyle = {
    ...fontSemibold14,

    color: neutralA3,
  };
  const cardContent: TextStyle = {
    ...fontSemibold12,

    color: neutralA3,
    width:
      width < MOBILE_WIDTH
        ? (width - 75) * 0.9 - 2 * layout.spacing_x2 - 50
        : undefined,
    marginTop: layout.spacing_x0_5,
  };
  const cardContainer: ViewStyle = {
    width: "100%",
    borderRadius: layout.spacing_x1_5,
    backgroundColor: neutral17,
    padding: layout.spacing_x2,
  };
  const cardTitle: TextStyle = { ...fontSemibold14 };
  const pageContainer: ViewStyle = {
    paddingVertical: layout.contentSpacing,
  };
  const apiInput: TextStyle = {
    ...fontSemibold14,
    padding: layout.spacing_x2,
    borderColor: neutral33,
    borderWidth: 1,
    backgroundColor: neutral00,
    borderRadius: layout.spacing_x1_5,
    color: secondaryColor,
  };

  return {
    switchBox,
    bigTitle,
    cardSubtitle,
    cardContent,
    cardContainer,
    cardTitle,
    pageContainer,
    apiInput,
  };
};
