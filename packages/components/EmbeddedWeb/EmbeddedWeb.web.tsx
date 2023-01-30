import React from "react";

import { IFrameProps } from "./EmbeddedWeb";

export const EmbeddedWeb: React.FC<IFrameProps> = ({
  uri,
  width,
  height,
  borderRadius = 7,
}) => {
  return (
    <iframe
      src={uri}
      style={{
        width: "100%",
        maxWidth: width,
        height,
        border: 0,
        borderRadius,
      }}
      allowFullScreen
    />
  );
};
