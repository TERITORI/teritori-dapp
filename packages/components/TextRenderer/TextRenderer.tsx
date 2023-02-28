import React, { useMemo } from "react";

import { HANDLE_REGEX, URL_REGEX } from "../../utils/regex";
import { HashRender } from "./HashRenderer";
import { MentionRender } from "./MentionRenderer";
import { UrlRender } from "./URLRenderer";

const REFERENCE_REG_EXP = /--\S.+--/gm;

interface MatchText {
  type: "hash" | "url" | "mention";
  matchKey: string;
  text: string;
}

const Component = ({ type, text }: MatchText) => {
  if (!type) {
    return null;
  }

  if (type === "hash") {
    return <HashRender text={text} />;
  } else if (type === "url") {
    return <UrlRender text={text} />;
  } else if (type === "mention") {
    return <MentionRender text={text} />;
  }
  return null;
};

export const TextRenderer = ({ text }: { text: string }) => {
  const formattedText = useMemo(() => {
    let refText = text;
    const matchTextReference: MatchText[] = [];
    const hashMatch = text.match(/#\S+/g);
    const mentionMatch = text.match(new RegExp(HANDLE_REGEX, "g"));
    const urlMatch = text.match(new RegExp(URL_REGEX, "g"));

    hashMatch?.map((item, index) => {
      const matchKey = `--${index + 1}hash--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "hash", matchKey, text: item });
    });
    urlMatch?.map((item, index) => {
      const matchKey = `--${index + 1}url--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "url", matchKey, text: item });
    });
    mentionMatch?.map((item, index) => {
      const matchKey = `--${index + 1}mention--`;
      refText = refText.replace(item, matchKey);
      matchTextReference.push({ type: "mention", matchKey, text: item });
    });

    const splittedText = refText.split(REFERENCE_REG_EXP);
    return splittedText.map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <Component {...(matchTextReference[index] || {})} />
      </React.Fragment>
    ));
  }, [text]);

  return <>{formattedText}</>;
};
