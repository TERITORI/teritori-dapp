import React, { FC } from "react";

import { Banner } from "@/api/marketplace/v1/marketplace";
import { Link } from "@/components/Link";
import { HubBannerImage } from "@/components/hub/HubBanner/HubBannerImage";
import { useMaxResolution } from "@/hooks/useMaxResolution";

export const HubBanner: FC<{
  banner: Banner;
}> = ({ banner }) => {
  const { width } = useMaxResolution();
  return (
    <Link to={banner?.url} style={{ width: "100%", maxHeight: 500 }}>
      <HubBannerImage sourceURI={banner?.image} width={width} />
    </Link>
  );
};
