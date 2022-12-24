import React from "react";
import WebView from "react-native-webview";

export interface IFrameProps {
  uri: string;
  width: number;
  height: number;
  borderRadius?: number;
  autoplay?: boolean;
}

export const EmbeddedWeb: React.FC<IFrameProps> = ({
  uri,
  width,
  height,
  borderRadius = 7,
  autoplay = false,
}) => {
  return (
    <WebView
      autoPlay={autoplay}
      source={{ uri }}
      style={{
        width: "100%",
        maxWidth: width,
        height,
        border: 0,
        borderRadius,
      }}
      allowsFullscreenVideo
      soun
    />
  );
};
