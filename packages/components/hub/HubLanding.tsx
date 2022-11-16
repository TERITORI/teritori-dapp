import React from "react";
import { View, Image, Linking } from "react-native";

import defaultNewsBanner from "../../../assets/default-images/default-news-banner.png";
import airdropSVG from "../../../assets/icons/airdrop.svg";
import labsSVG from "../../../assets/icons/labs.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import stakingSVG from "../../../assets/icons/staking.svg";
import { CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace";
import { useImageResizer } from "../../hooks/useImageResizer";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
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
  // const navigateToCollection = useNavigateToCollection(
  //   `tori-${process.env.THE_RIOT_COLLECTION_ADDRESS}`
  // );

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }}>
        {/*TODO: redirect to rioters collection using collection id*/}
        {/*<TouchableOpacity onPress={navigateToCollection}>*/}
        <Image
          source={{
            uri: ipfsURLToHTTPURL(
              "ipfs://bafkreibczqgfdj54fgco2oaw6wkanglktduwgj2j5qnhuh3olsg57uxtsm"
            ),
          }}
          style={{
            height,
            width,
            borderRadius: 20,
            marginTop: 56,
          }}
        />
        {/*</TouchableOpacity>*/}

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
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
      </View>
    </View>
  );
};
