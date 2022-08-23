import React from "react";
import {
  View,
  Image,
  ViewStyle,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { SvgProps } from "react-native-svg";

import dappCardSVG from "../../../assets/cards/dapp-card.svg";
import airdropSVG from "../../../assets/icons/airdrop.svg";
import certifiedSVG from "../../../assets/icons/certified.svg";
import labsSVG from "../../../assets/icons/labs.svg";
import launchpadSVG from "../../../assets/icons/launchpad.svg";
import marketplaceSVG from "../../../assets/icons/marketplace.svg";
import stakingSVG from "../../../assets/icons/staking.svg";
import walletSVG from "../../../assets/icons/wallet.svg";
import logoSVG from "../../../assets/logos/logo.svg";
import { useLaunchpadData } from "../../context/LaunchpadProvider";
import { useWallets } from "../../context/WalletsProvider";
import { LaunchpadItem } from "../../utils/airtable";
import { useAppNavigation } from "../../utils/navigation";
import { helpAreaWidth, sidebarWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { CarouselSection } from "../CarouselSection";
import { Guardian } from "../Guardian";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { HollowPrimaryButton } from "../buttons/HollowPrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { CardOutline } from "../cards/CardOutline";
import { LabelCard } from "../cards/LabelCard";

const breakPoint = 768;
const gridHalfGutter = 12;

const launchpadItemHeight = 266;
const launchpadItemWidth = 196;

const LaunchpadItemView: React.FC<{
  item: LaunchpadItem;
}> = ({ item }) => {
  return (
    <CardOutline
      style={{
        paddingTop: 12,
        paddingBottom: 20,
        width: launchpadItemWidth,
        height: launchpadItemHeight,
      }}
    >
      <Image
        source={{ uri: item.imageURL }}
        style={{
          width: 172,
          height: 172,
          alignSelf: "center",
          borderRadius: 12,
        }}
      />
      <View style={{ marginHorizontal: 12, marginTop: 16 }}>
        <BrandText
          style={{ fontSize: 14 }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.name}
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <BrandText
            style={{ color: "#AEB1FF", fontSize: 14 }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {item.creatorName}
          </BrandText>
          {item.isCertified && (
            <SVG
              width={16}
              height={16}
              source={certifiedSVG}
              style={{ marginLeft: 14 }}
            />
          )}
        </View>
      </View>
    </CardOutline>
  );
};

const PrimaryBox: React.FC<{ style?: ViewStyle }> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          borderColor: "#00C6FB",
          borderWidth: 1,
          borderRadius: 8,
          padding: 20,
        },
        style,
      ]}
    >
      <>{children}</>
    </View>
  );
};

const DAppCard: React.FC<{
  label: string;
  description: string;
  info: string;
  onPress?: () => void;
  iconSVG: React.FC<SvgProps>;
}> = ({ label, description, info, onPress, iconSVG }) => {
  const labelFontSize = 20;
  const descriptionFontSize = 14;
  const borderRadius = 20;
  return (
    <TouchableOpacity style={{ margin: gridHalfGutter }} onPress={onPress}>
      <SVG
        width={350}
        height={166}
        source={dappCardSVG}
        style={{ position: "absolute" }}
      />
      <View
        style={{
          width: 350,
          height: 166,
          flexDirection: "row",
          justifyContent: "flex-start",
          borderRadius,
          alignItems: "center",
        }}
      >
        <SVG
          width={40}
          height={40}
          source={iconSVG}
          style={{ marginLeft: 68, position: "absolute" }}
        />
        <View
          style={{
            width: 350,
            height: 166,
            flexDirection: "row",
            justifyContent: "flex-start",
            borderRadius,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
              paddingTop: 16,
              paddingRight: 20,
              paddingBottom: 18,
              paddingLeft: 144,
              height: 166,
            }}
          >
            <BrandText
              style={{
                color: "white",
                fontSize: labelFontSize,
                letterSpacing: -(labelFontSize * 0.04),
              }}
            >
              {label}
            </BrandText>
            <View>
              <BrandText
                style={{
                  color: "#A3A3A3",
                  fontSize: descriptionFontSize,
                  fontWeight: "500",
                  letterSpacing: -(descriptionFontSize * 0.04),
                }}
              >
                {description}
              </BrandText>
            </View>
            <BrandText style={{ color: "#777777", fontSize: 13 }}>
              {info}
            </BrandText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyWalletsCard: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const { wallets } = useWallets();

  const connectedWalletsCount = wallets.filter(
    (wallet) => wallet.publicKey
  ).length;

  return (
    <DAppCard
      label="My Wallets"
      description="IBC & Multichain Wallets
Connect & Manage"
      info={`${
        connectedWalletsCount > 0 ? connectedWalletsCount : "No"
      } wallet${connectedWalletsCount > 1 ? "s" : ""} connected`}
      iconSVG={walletSVG}
      onPress={onPress}
    />
  );
};

const NewsBox: React.FC = () => {
  const { width } = useWindowDimensions();
  const navigation = useAppNavigation();

  const titleFontSize = 20;

  return (
    <PrimaryBox>
      {width <= breakPoint && (
        <View style={{ marginBottom: 44 }}>
          <Guardian />
        </View>
      )}
      <View
        style={
          width > breakPoint
            ? {
                flexDirection: "row",
                justifyContent: "space-between",
              }
            : undefined
        }
      >
        <View
          style={[
            width > breakPoint ? { flex: 1 } : { width: "100%" },
            { justifyContent: "space-between" },
          ]}
        >
          <BrandText
            style={{
              color: "white",
              fontSize: titleFontSize,
              letterSpacing: -(titleFontSize * 0.04),
              lineHeight: 24,
            }}
          >
            The Exclusive Genesis Guardians Collection:
            {"\n"}
            Be early, Be Guardian of Teritori.
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
              lineHeight: 16,
              color: "#777777",
              marginTop: 16,
            }}
          >
            For decades, the destruction of ecosystems and social relations has
            turned people into soulless robots. At the same time, inequality
            explodes every year and misery becomes the norm for the silent
            majority.{"\n"}
            {"\n"}This Guardian Collection is a genesis collection of a
            Play2Earn Multichain Experience, where players will earn rewards for
            defending their community.
          </BrandText>
          <View
            style={{
              alignItems: "flex-start",
              marginTop: 40,
            }}
          >
            <SecondaryButton
              height={48}
              text="Join the Mint"
              onPress={() => navigation.navigate("Mint")}
            />
          </View>
        </View>
        {width > breakPoint && (
          <View style={{ marginLeft: 44 }}>
            <Guardian />
          </View>
        )}
      </View>
    </PrimaryBox>
  );
};

export const HubLanding: React.FC = () => {
  const navigation = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { launchpadItems: unfilteredLaunchpadItems } = useLaunchpadData();
  const launchpadItems = unfilteredLaunchpadItems.filter(
    (item) => item.shouldDisplay && item.imageURL
  );

  return (
    <View style={{ width: "100%" }}>
      <View style={{ flex: 1 }}>
        <Section title="Highlighted News">
          <NewsBox />
        </Section>
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
        <CarouselSection
          title="Upcoming Launches on Teritori Launch Pad"
          data={launchpadItems}
          renderItem={LaunchpadItemView}
          width={launchpadItemWidth + 24}
          height={launchpadItemHeight}
          loop={false}
          style={{
            width: windowWidth - (helpAreaWidth + sidebarWidth),
          }}
        />
        <View
          style={{
            flexDirection: "row",
            margin: -gridHalfGutter,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <HollowPrimaryButton
            text="Apply to the Launch Pad"
            style={{ margin: gridHalfGutter }}
          />
          <HollowPrimaryButton
            text="Explore All Upcoming Launches"
            style={{ margin: gridHalfGutter }}
          />
          <HollowPrimaryButton
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
