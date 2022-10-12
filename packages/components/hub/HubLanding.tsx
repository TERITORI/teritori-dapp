import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

import defaultNewsBanner from "../../../assets/default-images/default-news-banner.png";
import airdropSVG from "../../../assets/icons/airdrop.svg";
import labsSVG from "../../../assets/icons/labs.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import stakingSVG from "../../../assets/icons/staking.svg";
import logoSVG from "../../../assets/logos/logo.svg";
import { CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace";
import { useAppNavigation } from "../../utils/navigation";
import { screenContentMaxWidth } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { PrimaryButtonOutline } from "../buttons/PrimaryButtonOutline";
import { DAppCard } from "../cards/DAppCard";
import { LabelCard } from "../cards/LabelCard";
import { MyWalletsCard } from "../cards/MyWalletsCard";
import { CollectionsCarouselSection } from "../carousels/CollectionsCarouselSection";
import { NewsCarouselSection } from "../carousels/NewsCarouselSection";

const gridHalfGutter = 12;

export const HubLanding: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }}>
        {/*TODO: redirect to rioters collection using collection id*/}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Collection", { id: "rioters_collection_id" })
          }
        >
          <Image
            source={defaultNewsBanner}
            style={{
              height: 350,
              width: "100%",
              maxWidth: screenContentMaxWidth,
              borderRadius: 20,
              marginTop: 56,
            }}
          />
        </TouchableOpacity>

        <NewsCarouselSection />

        <Section title="My Dashboard">
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -gridHalfGutter,
            }}
          >
            <MyWalletsCard onPress={() => navigation.navigate("Wallets")} />
            <DAppCard
              onPress={() => navigation.navigate("Staking")}
              label="Staking"
              description="Participate to the Security
Get rewards by delegating to Teritori validators"
              info="Staking on Keplr!"
              iconSVG={stakingSVG}
            />
            <DAppCard
              label="Airdrop"
              description="Get $TORI
Join Teritori Community "
              info="Coming soon"
              iconSVG={airdropSVG}
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
              description="Want to build new dApps?
Join the Bounty Program
& get your project funded."
              info="Apply here"
              iconSVG={airdropSVG}
            />
          </View>
        </Section>
        <CollectionsCarouselSection
          title="Upcoming Launches on Teritori Launch Pad"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
        <View
          style={{
            flexDirection: "row",
            margin: -gridHalfGutter,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 56,
          }}
        >
          <PrimaryButtonOutline
            size="XL"
            text="Apply to the Launch Pad"
            style={{ margin: gridHalfGutter }}
          />
          <PrimaryButtonOutline
            size="XL"
            text="Explore All Upcoming Launches"
            style={{ margin: gridHalfGutter }}
          />
          <PrimaryButtonOutline
            size="XL"
            text="Vote on Upcoming Launches"
            style={{ margin: gridHalfGutter }}
          />
        </View>
        <View
          style={{
            marginTop: 274,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <SVG width={68} height={68} source={logoSVG} />
        </View>
      </View>
    </View>
  );
};
