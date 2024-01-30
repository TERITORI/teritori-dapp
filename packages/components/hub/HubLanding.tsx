import React from "react";
import { View, Linking } from "react-native";

import airdropSVG from "../../../assets/icons/airdrop.svg";
import labsSVG from "../../../assets/icons/labs.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import stakingSVG from "../../../assets/icons/staking.svg";
import {
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useBanners } from "../../hooks/useBanners";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { useAppNavigation } from "../../utils/navigation";
import { Link } from "../Link";
import { OptimizedImage } from "../OptimizedImage";
import { Section } from "../Section";
import { DAppCard } from "../cards/DAppCard";
import { LabelCard } from "../cards/LabelCard";
import { MyWalletsCard } from "../cards/MyWalletsCard";
import { CollectionsCarouselSection } from "../carousels/CollectionsCarouselSection";
import { NewsCarouselSection } from "../carousels/NewsCarouselSection";

const gridHalfGutter = 12;

export const HubLanding: React.FC = () => {
  const navigation = useAppNavigation();
  const { width } = useMaxResolution();
  const networkId = useSelectedNetworkId();
  const banners = useBanners(networkId);
  const banner = banners?.length ? banners[0] : undefined;

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }}>
        {!!banner && (
          <Link to={banner?.url || ""}>
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
        )}

        <NewsCarouselSection />

        <Section title="My Dashboard">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -gridHalfGutter,
            }}
          >
            <MyWalletsCard
              onPress={() => navigation.navigate("WalletManager")}
            />
            <DAppCard
              onPress={() => navigation.navigate("Staking")}
              label="Staking"
              description="Participate to the Security Get rewards by delegating to Teritori validators"
              info="Staking on Keplr!"
              iconSVG={stakingSVG}
            />
            <DAppCard
              label="Marketplace"
              description="Trade your NFTs & TNS and rank up on your profile by contributing to expansion"
              info="Explore Collections"
              iconSVG={marketplaceSVG}
              onPress={() => navigation.navigate("Marketplace")}
            />
            <DAppCard
              label="Launchpad"
              description="Apply to a NFT Launch on Teritori Launchpad and get validated & pushed by the community."
              info="Apply here"
              iconSVG={launchpadSVG}
              onPress={() => navigation.navigate("Launchpad")}
            />
            <DAppCard
              label="Tori Labs"
              description="Get funds to develop, contribute and build new feature for Communities"
              info="Apply here"
              iconSVG={labsSVG}
              onPress={() => Linking.openURL("https://teritori.com/grants")}
            />
          </View>
        </Section>
        <Section title="Coming soon dApps">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -gridHalfGutter,
            }}
          >
            <LabelCard label="Raffle" style={{ margin: gridHalfGutter }} />
            <LabelCard label="Lottery" style={{ margin: gridHalfGutter }} />
            <LabelCard
              label="Group
Chats"
              style={{ margin: gridHalfGutter }}
            />
            <LabelCard
              label="DAO
Launch"
              style={{ margin: gridHalfGutter }}
            />
            <DAppCard
              label="Contribute!"
              description="Want to build new dApps? Join the Bounty Program & get your project funded."
              info="Apply here"
              iconSVG={airdropSVG}
              onPress={() => Linking.openURL("https://app.dework.xyz/teritori")}
            />
          </View>
        </Section>
        <CollectionsCarouselSection
          title="Upcoming Launches on Teritori Launch Pad"
          req={{
            upcoming: true,
            networkId,
            sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
            sort: Sort.SORT_UNSPECIFIED,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />
      </View>
    </View>
  );
};
