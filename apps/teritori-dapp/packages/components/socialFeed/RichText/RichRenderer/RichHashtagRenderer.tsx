import React, { ReactNode } from "react";

import { primaryColor } from "../../../../utils/style/colors";
export const RichHashtagRenderer = (props: { children: ReactNode }) => {
  return <span style={{ color: primaryColor }}>{props.children}</span>;
};
