import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View, Image, Linking } from "react-native";
import { useSelector } from "react-redux";

import defaultNewsBanner from "../../../assets/default-images/default-news-banner.png";
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
import { useBackendClient } from "../../hooks/useBackendClient";
import { useImageResizer } from "../../hooks/useImageResizer";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { isNetworkTestnet } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { Link } from "../Link";
import { Section } from "../Section";
import { DAppCard } from "../cards/DAppCard";
import { LabelCard } from "../cards/LabelCard";
import { MyWalletsCard } from "../cards/MyWalletsCard";
import { CollectionsCarouselSection } from "../carousels/CollectionsCarouselSection";
import { NewsCarouselSection } from "../carousels/NewsCarouselSection";

const gridHalfGutter = 12;

export const HubLanding: React.FC = () => {
  const navigation = useAppNavigation();
  const { width: maxWidth } = useMaxResolution();
  const { width, height } = useImageResizer({
    image: defaultNewsBanner,
    maxSize: { width: maxWidth },
  });
  const banners = useBanners();
  const banner = banners?.length ? banners[0] : undefined;

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }}>
        <Link to={banner?.url || ""}>
          <Image
            source={{
              uri: ipfsURLToHTTPURL(banner?.image),
            }}
            style={{
              height,
              width,
              borderRadius: 20,
              marginTop: 56,
            }}
          />
        </Link>

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
              label="Airdrop"
              description="Get $TORI Join Teritori Community "
              info="Let's Go!"
              iconSVG={airdropSVG}
              onPress={() => Linking.openURL("https://teritori.com/airdrop")}
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
            networkId: "",
            sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
            sort: Sort.SORTING_UNSPECIFIED,
            limit: 16,
            offset: 0,
            mintState: MintState.MINT_STATE_UNSPECIFIED,
          }}
        />
      </View>
    </View>
  );
};

//TODO: networkId instead of testnet. ==> Wait for backend modif
const useBanners = () => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const { backendClient } = useBackendClient();

  const { data } = useQuery(
    ["banners", isNetworkTestnet(selectedNetworkId)],
    async () => {
      const { banners } = await backendClient.Banners({
        testnet: isNetworkTestnet(selectedNetworkId),
      });
      return banners;
    },
    { staleTime: Infinity }
  );
  return data;
};
