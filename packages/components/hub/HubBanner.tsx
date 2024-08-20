import React, { FC } from "react";

import { Banner } from "@/api/marketplace/v1/marketplace";
import { Link } from "@/components/Link";
import { OptimizedImage } from "@/components/OptimizedImage";

export const HubBanner: FC<{
  banner: Banner;
  width: number;
}> = ({ banner, width }) => {
  return (
    <Link to={banner?.url} style={{ width: "100%", maxHeight: 500 }}>
      <OptimizedImage
        sourceURI={banner?.image}
        width={width}
        height={350}
        style={{
          height: 350,
          width,
          borderRadius: 20,
          marginTop: 56,
        }}
      />
    </Link>
  );
};
