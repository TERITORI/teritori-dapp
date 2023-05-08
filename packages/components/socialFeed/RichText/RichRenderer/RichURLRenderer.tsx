import React from "react";

import { primaryColor } from "../../../../utils/style/colors";
export const RichURLRenderer = (props: {
  children: { props: { text: string } }[];
}) => {
  return (
    <span style={{ color: primaryColor, textDecoration: "underline" }}>
      {props.children}
    </span>
  );
};
