import React from "react";
import WebView from "react-native-webview";

export interface IFrameProps {
  uri: string;
  width: number;
  height: number;
}

export const EmbeddedWeb: React.FC<IFrameProps> = ({ uri, width, height }) => {
  return (
    <WebView
      source={{ uri }}
      style={{
        width: "100%",
        maxWidth: width,
        height,
        border: 0,
        borderRadius: 8,
      }}
      allowsFullscreenVideo
    />
  );
};
