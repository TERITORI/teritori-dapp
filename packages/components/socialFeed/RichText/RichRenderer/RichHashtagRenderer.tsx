import React from "react";

import { primaryColor } from "../../../../utils/style/colors";
export const RichHashtagRenderer = (props: { children: React.ReactNode }) => {
  return <span style={{ color: primaryColor }}>{props.children}</span>;
};
