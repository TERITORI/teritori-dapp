import { CID } from "multiformats";
import React, { memo, useEffect } from "react";
import { Image, ImageProps, View, PixelRatio } from "react-native";

import { neutral33 } from "../utils/style/colors";

/**
 * This only supports uri images since the proxy is only for external images
 * The width and height props are the source image dimensions, they should not be dynamic, otherwise it will overwelm the resizing proxy
 */
export const OptimizedImage: React.FC<
  Omit<ImageProps, "source" | "crossOrigin"> & {
    width: number;
    height: number;
    sourceURI?: string | null;
    fallbackURI?: string | null;
  }
> = memo(
  ({
    sourceURI: baseSourceURI,
    width,
    height,
    fallbackURI,
    ...passthrough
  }) => {
    const [isError, setIsError] = React.useState(false);
    const [isFallbackError, setIsFallbackError] = React.useState(false);
    const shouldUseFallback = !baseSourceURI || isError;
    // const sourceURI = shouldUseFallback ? fallbackURI : baseSourceURI;
    const sourceWidth = PixelRatio.getPixelSizeForLayoutSize(width);
    const sourceHeight = PixelRatio.getPixelSizeForLayoutSize(height);

    useEffect(() => {
      setIsError(false);
    }, [baseSourceURI]);

    useEffect(() => {
      setIsFallbackError(false);
    }, [fallbackURI]);

    if ((shouldUseFallback && !fallbackURI) || isFallbackError) {
      return (
        <View style={[{ backgroundColor: neutral33 }, passthrough.style]} />
      );
    }

    /*
    // imported images are already a valid source object
    const source =
      (typeof sourceURI === "string"
        ? { uri: transformURI(sourceURI, sourceWidth, sourceHeight) }
        : sourceURI) || {};
      */

    return (
      <Image
        crossOrigin={
          baseSourceURI?.includes("mypinata.cloud") ? "anonymous" : undefined
        }
        onError={() => {
          if (shouldUseFallback) {
            setIsFallbackError(true);
            return;
          }
          setIsError(true);
        }}
        source={{
          uri: transformURI(baseSourceURI || "", sourceWidth, sourceHeight),
        }}
        {...passthrough}
      />
    );
  },
);

const transformURI = (
  uri: string | undefined,
  width: number,
  height: number,
) => {
  if (typeof uri !== "string" || !uri) {
    return "";
  }

  const isRelative = uri.startsWith("/");
  if (isRelative) {
    return uri;
  }

  // detect if raw CID
  try {
    CID.parse(uri);
    uri = "ipfs://" + uri;
  } catch {}

  const knownScheme = ["https://", "http://", "ipfs://"].find((scheme) =>
    uri?.startsWith(scheme),
  );
  if (!knownScheme) {
    return uri;
  }

  if (uri?.startsWith("ipfs://")) {
    return `https://teritori.mypinata.cloud/ipfs/${uri.substring("ipfs://".length)}?img-width=${Math.round(width)}&img-height=${Math.round(height)}&img-fit=cover`;
  }

  const params = resolveParams(width, height);

  return `${process.env.EXPO_PUBLIC_IMG_PROXY_URL}${params}/plain/${encodeURIComponent(
    uri,
  )}`;
};

const resolveParams = (width: number, height: number) => {
  const params: string[] = [];
  params.push(`width:${Math.round(width)}`);
  params.push(`height:${Math.round(height)}`);

  return params.join("/");
};
