export const fixLinkOnHTMLString = (htmlString: string) => {
  try {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    let lastIndex = 0;
    let result = "";

    const matches = htmlString.matchAll(urlRegex);

    for (const match of matches) {
      result += htmlString.substring(lastIndex, match.index || 0);

      const url = match[0];

      const isInAnchorTag = isInsideAnchorTag(
        htmlString,
        match?.index || 0,
        url.length,
      );
      if (!isInAnchorTag) {
        const linkString = `<a href="${url}">${url}</a>`;
        result += linkString;
      } else {
        result += url;
      }

      lastIndex = (match.index || 0) + url.length;
    }

    result += htmlString.substring(lastIndex);

    return result;
  } catch {
    return htmlString;
  }
};

const isInsideAnchorTag = (
  htmlString: string,
  index: number,
  length: number,
) => {
  const substringAfterIndex = htmlString.substring(
    index + length,
    index + length + 8,
  );

  const quoteMatchAfter = substringAfterIndex.trim().startsWith('"');
  const closingTagMatchAfter = substringAfterIndex.trim().startsWith("</a");

  if (quoteMatchAfter || closingTagMatchAfter) {
    return true;
  }

  return false;
};
