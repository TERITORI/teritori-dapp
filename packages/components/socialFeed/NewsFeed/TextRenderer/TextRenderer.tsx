import React, { useMemo } from "react";

import {
  hashtagMatch,
  mentionMatch,
  urlMatch,
} from "../../../../utils/social-feed";
import { HashtagRenderer } from "./HashtagRenderer";
import { MentionRenderer } from "./MentionRenderer";
import { URLRenderer } from "./URLRenderer";

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

export const TextRenderer = ({ text }: { text: string }) => {
  const formattedText = useMemo(() => {
    let refText = text.replace("/generate", "🖼️").replace("/question", "❓");
    const matchTextReference: MatchText[] = [];

    hashtagMatch(text)?.map((item, index) => {
      const matchKey = `--${index + 1}hashtag--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "hashtag", matchKey, text: item });
    });
    urlMatch(text)?.map((item, index) => {
      const matchKey = `--${index + 1}url--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "url", matchKey, text: item });
    });
    mentionMatch(text)?.map((item, index) => {
      const matchKey = `--${index + 1}mention--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "mention", matchKey, text: item });
    });

    // Splitting the text in parts that start by a matchKey
    const splittedText = refText.split(REFERENCE_REGEX);
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
  }, [text]);

  return <>{formattedText}</>;
};
