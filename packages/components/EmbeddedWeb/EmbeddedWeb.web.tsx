import React from "react";

import { IFrameProps } from "./EmbeddedWeb";

export const EmbeddedWeb: React.FC<IFrameProps> = ({ uri, width, height }) => {
  return (
    <iframe
      src={uri}
      style={{
        width: "100%",
        maxWidth: width,
        height,
        border: 0,
        borderRadius: 8,
      }}
      allowFullScreen
    />
  );
};
