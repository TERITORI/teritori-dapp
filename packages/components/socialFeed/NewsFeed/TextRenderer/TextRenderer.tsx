import React, { useMemo } from "react";

import { HashtagRenderer } from "./HashtagRenderer";
import { MentionRenderer } from "./MentionRenderer";
import { URLRenderer } from "./URLRenderer";
import {
  hashtagMatch,
  mentionMatch,
  NB_ROWS_SHOWN_IN_PREVIEW,
  urlMatch,
} from "../../../../utils/social-feed";
import { neutral77, neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";

const REFERENCE_REGEX = /(?=--\S.+--)/gm;

interface MatchText {
  type: "hashtag" | "url" | "mention";
  matchKey: string;
  text: string;
}
interface ItemMatchAssociation {
  item: string;
  matchText?: MatchText;
}

const Component = ({ type, text }: MatchText) => {
  if (!type) {
    return null;
  }

  if (type === "hashtag") {
    return <HashtagRenderer text={text} />;
  } else if (type === "url") {
    return <URLRenderer text={text} />;
  } else if (type === "mention") {
    return <MentionRenderer text={text} />;
  }
  return null;
};

export const TextRenderer = ({
  text,
  isPreview,
}: {
  text: string;
  isPreview?: boolean;
}) => {
  const refText = useMemo(
    () => text.replace("/generate", "🖼️").replace("/question", "❓"),
    [text],
  );
  const isTruncateNeeded = useMemo(
    () => isPreview && refText.split("\n").length >= NB_ROWS_SHOWN_IN_PREVIEW,
    [refText, isPreview],
  );

  const formattedText = useMemo(() => {
    let finalText = refText;
    if (isTruncateNeeded) {
      finalText = finalText
        .split("\n")
        .splice(0, NB_ROWS_SHOWN_IN_PREVIEW)
        .join("\n");
    }
    const matchTextReference: MatchText[] = [];

    hashtagMatch(refText)?.map((item, index) => {
      const matchKey = `--${index + 1}hashtag--`;
      finalText = finalText.replace(item, matchKey);
      matchTextReference.push({ type: "hashtag", matchKey, text: item });
    });
    urlMatch(refText)?.map((item, index) => {
      const matchKey = `--${index + 1}url--`;
      finalText = finalText.replace(item, matchKey);
      matchTextReference.push({ type: "url", matchKey, text: item });
    });
    mentionMatch(refText)?.map((item, index) => {
      const matchKey = `--${index + 1}mention--`;
      finalText = finalText.replace(item, matchKey);
      matchTextReference.push({ type: "mention", matchKey, text: item });
    });

    // Splitting the text in parts that start by a matchKey
    const splittedText = finalText.split(REFERENCE_REGEX);
    // For each part
    return splittedText.map((item, index) => {
      // We need to associate the matchKey and its text to the corresponding item
      const itemMatch: ItemMatchAssociation = { item };
      matchTextReference.forEach((m) => {
        if (item.includes(m.matchKey)) {
          itemMatch.matchText = m;
          itemMatch.item = item.replace(m.matchKey, "");
        }
      });
      // Then, display each text part with its associated matchText if exists
      return (
        <React.Fragment key={index}>
          {itemMatch.matchText && <Component {...itemMatch.matchText} />}
          {itemMatch.item}
        </React.Fragment>
      );
    });
  }, [refText, isTruncateNeeded]);

  return (
    <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
      {formattedText}
      {isTruncateNeeded && (
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          {"\n...see more"}
        </BrandText>
      )}
    </BrandText>
  );
};
