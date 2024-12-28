import { Element as DomHandlerElement } from "domhandler";
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

// DOM modifications on document, texts, or elements from react-native-render-html.
// Because react-native-render-html doesn't allow common CSS selectors, we need to style tags using domVisitors callbacks
export const renderHtmlDomVisitors = {
  onElement: (element: DomHandlerElement) => {
    // Removing marginBottom from the child p of blockquote
    if (
      element.name === "blockquote" &&
      element.children &&
      element.children.length > 0
    ) {
      const tagChild = element.children.find((child) => child.type === "tag");
      // tagChild is a domhandler Node. It doesn't have attribs, but it has attribs in fact (wtf ?)
      if (tagChild && "attribs" in tagChild) {
        tagChild.attribs = {
          style: "margin-bottom: 0",
        };
      }
    }
  },
};

// HTML tags styles used by RenderHtml from react-native-render-html
type HtmlTagStyle = Record<string, string | number>;
const baseTextStyle: HtmlTagStyle = {
  color: neutralA3,
  fontSize: 14,
  letterSpacing: -(14 * 0.04),
  lineHeight: 22,
  fontFamily: "Exo_500Medium",
  fontWeight: "500",
};
const baseBlockStyle: HtmlTagStyle = {
  marginTop: 0,
  marginBottom: 16,
};
const baseCodeStyle: HtmlTagStyle = {
  ...baseTextStyle,
  fontSize: 13,
  letterSpacing: -(13 * 0.04),
  backgroundColor: neutral17,
  borderRadius: 4,
};
const baseTableChildrenStyle: HtmlTagStyle = {
  borderColor: neutral33,
};
export const renderHtmlTagStyles: MixedStyleRecord = {
  body: {
    ...baseTextStyle,
  },
  p: {
    ...baseBlockStyle,
    ...baseTextStyle,
  },
  strong: { fontWeight: "700" },
  a: {
    color: primaryColor,
    textDecorationLine: "none",
  },
  hr: { backgroundColor: neutralA3 },
  h1: {
    ...baseTextStyle,
    color: neutralFF,
    fontSize: 28,
    letterSpacing: -(28 * 0.02),
    lineHeight: 37,
  },
  h2: {
    ...baseTextStyle,
    color: neutralFF,
    fontSize: 21,
    letterSpacing: -(21 * 0.02),
    lineHeight: 28,
  },
  h3: {
    ...baseTextStyle,
    color: neutralFF,
    fontSize: 16,
    letterSpacing: -(16 * 0.02),
    lineHeight: 23,
  },
  h4: {
    ...baseTextStyle,
    color: neutralFF,
    lineHeight: 20,
  },
  h5: {
    ...baseTextStyle,
    lineHeight: 20,
  },
  h6: {
    ...baseTextStyle,
    fontSize: 12,
    letterSpacing: -(12 * 0.04),
    lineHeight: 16,
  },
  ul: {
    ...baseBlockStyle,
    ...baseTextStyle,
    lineHeight: 20,
  },
  ol: {
    ...baseBlockStyle,
    ...baseTextStyle,
    lineHeight: 20,
  },

  blockquote: {
    ...baseBlockStyle,
    ...baseTextStyle,
    color: neutral67,
    lineHeight: 20,
    marginLeft: 0,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderLeftColor: neutral67,
  },

  code: {
    ...baseCodeStyle,
    marginVertical: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  pre: {
    ...baseBlockStyle,
    ...baseCodeStyle,
    paddingHorizontal: 8,
  },

  table: {
    marginBottom: 16,
  },
  thead: {
    ...baseTableChildrenStyle,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    backgroundColor: neutral17,
  },
  th: {
    ...baseTableChildrenStyle,
    padding: 8,
  },
  tbody: {
    ...baseTableChildrenStyle,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  tr: {
    ...baseTableChildrenStyle,
  },
  td: {
    ...baseTableChildrenStyle,
    borderTopWidth: 0.5,
    padding: 8,
  },
};
