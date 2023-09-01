import { StyleSheet, useWindowDimensions } from "react-native";

import {
  neutral00,
  neutral17,
  neutral33,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const MOBILE_WIDTH = 768;
const padWidth = 1024;

export const useCommonStyles = () => {
  const { width } = useWindowDimensions();

  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  return StyleSheet.create({
    switchBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      margin: layout.spacing_x1,
    },
    bigTitle: StyleSheet.flatten([
      fontSemibold20,
      {
        paddingTop: layout.spacing_x4,
        paddingLeft: layout.spacing_x2,
      },
    ]),
    cardSubtitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    cardContent: StyleSheet.flatten([
      fontSemibold12,
      {
        color: neutralA3,
        width:
          width < MOBILE_WIDTH
            ? (width - 75) * 0.9 - 2 * layout.spacing_x2 - 50
            : undefined,
        marginTop: layout.spacing_x0_5,
      },
    ]),
    cardContainer: {
      width: "100%",
      borderRadius: layout.spacing_x1_5,
      backgroundColor: neutral17,
      padding: layout.spacing_x2,
    },
    cardTitle: StyleSheet.flatten([fontSemibold14]),

    pageContainer: {
      width:
        width < padWidth
          ? width < MOBILE_WIDTH
            ? (width - 75) * 0.9
            : (width - 209) * 0.9
          : 676,
      margin: "auto",
      paddingTop: layout.contentSpacing,
    },
    apiInput: {
      fontSize: 14,
      color: "white",
      fontFamily: "Exo_600SemiBold",
      padding: layout.spacing_x2,
      borderColor: neutral33,
      borderWidth: 1,
      backgroundColor: neutral00,
      borderRadius: layout.spacing_x1_5,
    },
  });
};
