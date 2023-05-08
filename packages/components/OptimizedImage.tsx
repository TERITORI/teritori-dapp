import React from "react";
import { Image, ImageProps } from "react-native";

export const OptimizedImage: React.FC<
  ImageProps & {
    width: number;
    height: number;
  }
> = ({ source, width, height, ...other }) => {
  if (typeof source === "number") {
    return <Image source={source} {...other} />;
  }
  return (
    <Image
      source={
        Array.isArray(source)
          ? source.map((s) => ({
              uri: transformURI(s.uri, width, height),
            }))
          : { uri: transformURI(source.uri, width, height) }
      }
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
