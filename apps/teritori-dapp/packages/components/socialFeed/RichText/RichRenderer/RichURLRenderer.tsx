import React, { ReactNode } from "react";

import { primaryColor } from "../../../../utils/style/colors";
export const RichURLRenderer = (props: { children: ReactNode }) => {
  return (
    <span style={{ color: primaryColor, textDecoration: "underline" }}>
      {props.children}
    </span>
  );
};
