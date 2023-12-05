import React from "react";
import { Image } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import { useBanners } from "../../hooks/useBanners";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import FlexCol from "../FlexCol";
import { Link } from "../Link";
import { PrimaryBox } from "../boxes/PrimaryBox";

export const TopMenuHighlightedNews: React.FC = () => {
  const networkId = useSelectedNetworkId();
  const banners = useBanners(networkId);
  const banner = banners?.length ? banners[0] : undefined;

  return (
    <TopMenuSection title="Highlighted News">
      <FlexCol>
        <Link to={banner?.url || ""}>
          <PrimaryBox>
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
