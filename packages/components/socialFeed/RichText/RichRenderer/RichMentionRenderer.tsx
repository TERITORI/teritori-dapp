import React, { ReactNode } from "react";

import { useMention } from "../../../../hooks/feed/useMention";
import { getReactNodeStringProp } from "../../../../utils/react";
import { neutralA3, primaryColor } from "../../../../utils/style/colors";

export const RichMentionRenderer = (props: { children: ReactNode }) => {
  const { userId } = useMention(getReactNodeStringProp(props.children, "text"));
  // Every text with a "@" is a mention. But we consider valid mentions as a valid wallet address or a valid NS token id.
  if (!userId) {
    return <span style={{ color: neutralA3 }}>{props.children}</span>;
  }
  return <span style={{ color: primaryColor }}>{props.children}</span>;
};
