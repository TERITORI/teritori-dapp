import { StyleSheet } from "react-native";

// reusable generic styles
export const genericStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
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
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  upperCase: {
    textTransform: "uppercase",
  },
  underline: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  rowWithWrap: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  rowWithWrapCenter: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  selfCenter: {
    alignSelf: "center",
  },
  selfStart: {
    alignSelf: "flex-start",
  },
  selfEnd: {
    alignSelf: "flex-end",
  },
  textDecorationLine: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  shadow: {
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5,

    elevation: 0.1,
    backgroundColor: "#fff",
  },
  positionRelative: {
    position: "relative",
  },
  positionAbsolute: {
    position: "absolute",
  },
  positionBottomStickyAbsolute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  positionTopStickyAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  flexEnd: {
    alignItems: "flex-end",
  },
  flexWrap: {
    flex: 1,
    flexWrap: "wrap",
  },
  stickyBottom: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  jcCenter: {
    justifyContent: "center",
  },
  aiCenter: {
    alignItems: "center",
  },
  lineHeight: {
    lineHeight: 24,
  },
  padding0: {
    padding: 0,
  },
  fullContentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  jcSb: {
    justifyContent: "space-between",
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
  flexJcCenter: {
    flex: 1,
    justifyContent: "center",
  },
  lineHeight0: {
    lineHeight: 0,
  },
  jcEnd: {
    justifyContent: "flex-end",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  aiEnd: {
    alignItems: "flex-end",
  },
  w100: {
    width: "100%",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  paddingTop0: {
    paddingTop: 0,
  },
  dispalyNone: {
    display: "none",
  },
  lottieQr: {
    position: "absolute",
    alignSelf: "center",
    top: -10,
    width: 350,
  },
  cardShadow: {
    shadowOffset: {
      height: 8,
      width: 0,
    },

    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  w100h100: {
    height: "100%",
    width: "100%",
  },
});
