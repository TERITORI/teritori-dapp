import { CID } from "multiformats";
import React, { memo, useEffect } from "react";
import { StyleSheet, Image, ImageProps, View, PixelRatio } from "react-native";

import { neutral33 } from "../utils/style/colors";

import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { gnoZenaoNetwork } from "@/networks/gno-zenao";
import { gnoZenaoStagingNetwork } from "@/networks/gno-zenao-staging";

/**
 * This only supports uri images since the proxy is only for external images
 * The width and height props are the source image dimensions, they should not be dynamic, otherwise it will overwelm the resizing proxy
 */
export const OptimizedImage: React.FC<
  Omit<ImageProps, "source" | "crossOrigin" | "onError"> & {
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
    style,
    ...passthrough
  }) => {
    const selectedNetworkId = useSelectedNetworkId();
    const [isError, setIsError] = React.useState(false);
    const [isFallbackError, setIsFallbackError] = React.useState(false);
    const shouldUseFallback = !baseSourceURI || isError;
    const sourceURI = shouldUseFallback ? fallbackURI : baseSourceURI;
    const sourceWidth = PixelRatio.getPixelSizeForLayoutSize(width);
    const sourceHeight = PixelRatio.getPixelSizeForLayoutSize(height);

    useEffect(() => {
      setIsError(false);
    }, [baseSourceURI]);

    useEffect(() => {
      setIsFallbackError(false);
    }, [fallbackURI]);

    if ((shouldUseFallback && !fallbackURI) || isFallbackError) {
      return <View style={[{ backgroundColor: neutral33 }, style]} />;
    }

    if (typeof sourceURI == "string" && sourceURI.startsWith("ipfs://")) {
      const flatStyle = StyleSheet.flatten(style);

      // XXX: we need to use and <img> tag for pinata since the crossOrigin param is mandatory and the one from react-native seems to not be used
      return (
        <img
          crossOrigin="anonymous"
          width={sourceWidth}
          height={sourceHeight}
          style={{
            objectFit: "contain",
            borderWidth: 0,
            borderStyle: "solid",
            ...(flatStyle as any),
          }}
          src={transformURI(
            sourceURI,
            sourceWidth,
            sourceHeight,
            selectedNetworkId,
          )}
        />
      );
    }

    // imported images are already a valid source object
    const source =
      (typeof sourceURI === "string"
        ? {
            uri: transformURI(
              sourceURI,
              sourceWidth,
              sourceHeight,
              selectedNetworkId,
            ),
          }
        : sourceURI) || {};

    return (
      <Image
        style={style}
        onError={() => {
          if (shouldUseFallback) {
            setIsFallbackError(true);
            return;
          }
          setIsError(true);
        }}
        source={source}
        {...passthrough}
      />
    );
  },
);

const transformURI = (
  uri: string | undefined,
  width: number,
  height: number,
  networkId: string,
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

  if (uri?.startsWith("ipfs://")) {
    const ipfsGateway =
      networkId === gnoZenaoNetwork.id ||
      networkId === gnoZenaoStagingNetwork.id
        ? "https://pinata.zenao.io"
        : "https://teritori.mypinata.cloud";

    // XXX: allow passing a dev token
    return `${ipfsGateway}/ipfs/${uri.substring("ipfs://".length)}?img-width=${Math.round(width)}&img-height=${Math.round(height)}&img-fit=contain`;
  }

  return uri;
};
