import React from "react";

import { IFrameProps } from "./EmbeddedWeb";

export const EmbeddedWeb: React.FC<IFrameProps> = ({
  uri ,
  width,
  height,
  borderRadius = 7,
  autoplay = false
}) => {
  // FIXME: Youtube videos can autoplay only if mute=1
  if(autoplay && uri.includes("www.youtube.com")) uri += "?autoplay=1&mute=1"

  return (
    <iframe
      allow={autoplay ? "autoplay" : ""}
      allowFullScreen
      src={uri}
      style={{
        width: "100%",
        maxWidth: width,
        height,
        border: 0,
        borderRadius,
      }}
    />
  );
};
