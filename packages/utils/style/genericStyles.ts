import { StyleSheet } from "react-native";

// reusable generic styles
export const genericStyles = StyleSheet.create({
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowWithCenterAndSB: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowWithSB: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowWithWrap: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  jcAiCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteContentCenter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  w100h100: {
    height: "100%",
    width: "100%",
  },
});
