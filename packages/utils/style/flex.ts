import { StyleSheet } from "react-native";

export const flex = StyleSheet.create({
  flex_1: {
    flex: 1,
  },

  flexRow: {
    flexDirection: "row",
  },

  flexCol: {
    flexDirection: "column",
  },

  alignCenter: {
    alignItems: "center",
    alignSelf: "center",
  },

  alignSelfCenter: {
    alignSelf: "center",
  },
  alignItemsCenter: {
    alignItems: "center",
  },

  justifyContentCenter: {
    justifyContent: "center",
  },
  justifyContentAround: {
    justifyContent: "space-around",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
});
