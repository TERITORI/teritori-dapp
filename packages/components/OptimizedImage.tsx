import React from "react";
import { Image, ImageProps, View, StyleSheet } from "react-native";

import { neutral33 } from "../utils/style/colors";

// This only supports uri images since the proxy is only for external images

export const OptimizedImage: React.FC<
  Omit<ImageProps, "source"> & {
    width: number;
    height: number;
    sourceURI?: string | null;
    fallbackURI?: string | null;
  }
> = ({ sourceURI: baseSourceURI, width, height, fallbackURI, ...other }) => {
  const [isError, setIsError] = React.useState(false);
  const [isFallbackError, setIsFallbackError] = React.useState(false);
  const shouldUseFallback = !baseSourceURI || isError;
  const sourceURI = shouldUseFallback ? fallbackURI : baseSourceURI;

  if ((shouldUseFallback && !fallbackURI) || isFallbackError) {
    return (
      <View
        style={{
          width,
          height,
          borderRadius: StyleSheet.flatten(other.style).borderRadius,
          backgroundColor: neutral33,
        }}
      />
    );
  }
  return (
    <Image
      onError={() => {
        if (shouldUseFallback) {
          setIsFallbackError(true);
          return;
        }
        setIsError(true);
      }}
      source={{
        uri: transformURI(sourceURI || undefined, width, height),
      }}
      {...other}
    />
  );
};

const transformURI = (
  uri: string | undefined,
  width: number,
  height: number
) => {
  if (!uri) {
    return "";
  }

  const isRelative = uri.startsWith("/");
  if (isRelative) {
    return uri;
  }

  const knownScheme = ["https://", "http://", "ipfs://"].find((scheme) =>
    uri.startsWith(scheme)
  );
  if (!knownScheme) {
    return uri;
  }

  const params = resolveParams(width, height);

  return `${process.env.IMG_PROXY_URL}${params}/plain/${encodeURIComponent(
    uri
  )}`;
};

const resolveParams = (width: number, height: number) => {
  const params: string[] = [];
  params.push(`width:${Math.round(width)}`);
  params.push(`height:${Math.round(height)}`);

  return params.join("/");
};
