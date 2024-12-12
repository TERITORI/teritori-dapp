import type { MixedStyleRecord } from "@native-html/transient-render-engine";

import {
  neutral17,
  neutralA3,
  neutralFF,
  primaryColor,
} from "@/utils/style/colors";

export type ContentMode = "EDITION" | "BOTH" | "PREVIEW";

export const markdownTagStyles: MixedStyleRecord = {
  body: {
    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 22,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  p: {
    marginVertical: 4,
    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 22,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  code: {
    color: neutralA3,
    fontSize: 13,
    letterSpacing: -(13 * 0.04),
    lineHeight: 22,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",

    backgroundColor: neutral17,
    marginVertical: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  pre: {
    fontSize: 13,
    letterSpacing: -(13 * 0.04),
    fontFamily: "Exo_500Medium",
    fontWeight: "500",

    backgroundColor: neutral17,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
  },
  strong: { fontWeight: "700" },
  a: {
    color: primaryColor,
    textDecorationLine: "none",
  },
  hr: { backgroundColor: neutralA3 },
  h1: {
    color: neutralFF,
    fontSize: 28,
    letterSpacing: -(28 * 0.02),
    lineHeight: 37,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  h2: {
    color: neutralFF,
    fontSize: 21,
    letterSpacing: -(21 * 0.02),
    lineHeight: 28,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  h3: {
    color: neutralFF,
    fontSize: 16,
    letterSpacing: -(16 * 0.02),
    lineHeight: 23,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  h4: {
    color: neutralFF,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 20,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  h5: {
    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 20,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  h6: {
    color: neutralA3,
    fontSize: 12,
    letterSpacing: -(12 * 0.04),
    lineHeight: 16,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
};
