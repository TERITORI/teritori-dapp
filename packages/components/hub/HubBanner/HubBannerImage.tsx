import React, { FC } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";

export const HubBannerImage: FC<{
  sourceURI: string;
  width: number;
}> = ({ sourceURI, width }) => {
  return (
    <OptimizedImage
      sourceURI={sourceURI}
      width={width}
      height={350}
      style={{
        height: 350,
        width,
        borderRadius: 20,
      }}
    />
  );
};
