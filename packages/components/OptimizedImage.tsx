import React from "react";
import { Image, ImageProps } from "react-native";

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
  const shouldUseFallback = (!baseSourceURI || isError) && !!fallbackURI;
  const sourceURI = shouldUseFallback ? fallbackURI : baseSourceURI;
  return (
    <Image
      onError={() => {
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
  if (typeof uri !== "string") {
    return uri;
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
