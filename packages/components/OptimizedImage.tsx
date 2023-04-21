import React from "react";
import { Image, ImageStyle, ImageURISource, StyleProp } from "react-native";

export const OptimizedImage: React.FC<{
  source: ImageURISource;
  width: number;
  height: number;
  style?: StyleProp<ImageStyle>;
}> = ({ source, style, width, height }) => {
  const params = resolveParams(width, height);
  const uri = `${process.env.IMG_PROXY_URL}${params}/plain/${source.uri}`;
  return <Image source={{ uri }} style={style} />;
};

const resolveParams = (width: number, height: number) => {
  const params: string[] = [];
  params.push(`width:${width}`);
  params.push(`height:${height}`);

  return params.join("/");
};
