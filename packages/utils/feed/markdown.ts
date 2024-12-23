import markdownit from "markdown-it";
import { full as emoji } from "markdown-it-emoji/dist/index.cjs";
import footnote_plugin from "markdown-it-footnote";
import { MixedStyleRecord } from "react-native-render-html";

import {
  neutral17,
  neutral33,
  neutral67,
  neutralA3,
  neutralFF,
  primaryColor,
} from "@/utils/style/colors";

export type ContentMode = "EDITION" | "BOTH" | "PREVIEW";

// The markdownit instance. Used to get the same parameters at Article creation and consultation.
export const articleMd = markdownit({
  linkify: true,
  breaks: true,
})
  .use(emoji)
  .use(footnote_plugin);

// HTML tags styles used by RenderHtml
export const renderHtmlTagStyles: MixedStyleRecord = {
  body: {
    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 22,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  p: {
    marginTop: 0,
    marginBottom: 16,

    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 22,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
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
  ul: {
    marginTop: 0,
    marginBottom: 16,

    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 20,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  ol: {
    marginTop: 0,
    marginBottom: 16,

    color: neutralA3,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 20,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",
  },
  blockquote: {
    marginTop: 0,
    marginBottom: 16,
    paddingBottom: -16,

    color: neutral67,
    fontSize: 14,
    letterSpacing: -(14 * 0.04),
    lineHeight: 20,
    fontFamily: "Exo_500Medium",
    fontWeight: "500",

    marginLeft: 0,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderLeftColor: neutral67,
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
    borderRadius: 4,

    marginTop: 0,
    marginBottom: 16,
  },
  table: {
    marginBottom: 16,
  },
  thead: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderColor: neutral33,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    backgroundColor: neutral17,
  },
  th: {
    borderColor: neutral33,
    padding: 8,
  },
  tbody: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderColor: neutral33,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  tr: {
    borderColor: neutral33,
  },
  td: {
    borderTopWidth: 0.5,
    borderColor: neutral33,
    padding: 8,
  },
};
