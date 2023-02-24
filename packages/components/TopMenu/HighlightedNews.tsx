import React from "react";
import { Image } from "react-native";

import { useBanners } from "../../hooks/useBanners";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { Link } from "../Link";
import { PrimaryBox } from "../boxes/PrimaryBox";
import FlexCol from "../FlexCol";
import { TopMenuSection } from "./TopMenuSection";

export const HighlightedNews: React.FC = () => {
  const banners = useBanners(
    process.env.TERITORI_NETWORK_ID === "teritori-testnet"
  );
  const banner = banners?.length ? banners[0] : undefined;

  return (
    <TopMenuSection title="Highlighted News">
      <FlexCol>
        <Link to={banner?.url || ""}>
          <PrimaryBox noBrokenCorners>
            <Image
              source={{
                uri: ipfsURLToHTTPURL(banner?.image),
              }}
              style={{
                height: 94,
                width: 298,
                borderRadius: 7,
              }}
            />
          </PrimaryBox>
        </Link>
      </FlexCol>
    </TopMenuSection>
  );
};
