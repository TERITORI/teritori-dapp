import React from "react";
import { View, Image, Linking } from "react-native";

import { ApplicationCard } from "./ApplicationCard";

import guardianPng from "@/assets/default-images/guardian_profile.png";
import discordSVG from "@/assets/icons/discord.svg";
import twitterSVG from "@/assets/icons/twitter.svg";
import websiteSVG from "@/assets/icons/website.svg";
import { BrandText } from "@/components/BrandText";
import { BoxStyle } from "@/components/boxes/Box";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SocialButton } from "@/components/buttons/SocialButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { collectionStatus } from "@/utils/launchpad";
import { neutral33 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

const breakpointM = 900;

export const ApplicationDetail: React.FC<{
  collection: CollectionDataResult;
}> = ({ collection }) => {
  const { width } = useMaxResolution();

  return (
    <View
      style={{
        flexDirection: width >= breakpointM ? "row" : "column-reverse",
        alignItems: width >= breakpointM ? "flex-start" : "center",
        justifyContent: "center",
      }}
    >
      {/* ===== Left container */}
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: neutral33,
            height: 28,
            paddingHorizontal: layout.spacing_x1_5,
            borderRadius: 999,
            justifyContent: "center",
          }}
        >
          <BrandText style={fontSemibold13}>
            {collectionStatus(collection)}
          </BrandText>
        </View>
        <BrandText style={[fontSemibold28, { marginTop: layout.spacing_x3 }]}>
          {collection.name}
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: layout.spacing_x1_5,
            gap: layout.spacing_x1_5,
            flexWrap: "wrap",
          }}
        >
          <ApplicationCard
            title="Supply"
            value={collection.expected_supply.toString()}
            style={applicationCardCStyle}
          />
          <ApplicationCard
            title="Price"
            value={collection.expected_public_mint_price.toString()}
            style={applicationCardCStyle}
          />
          <ApplicationCard
            title="Symbol"
            value={collection.symbol}
            style={applicationCardCStyle}
          />
        </View>
        <View style={{ marginTop: layout.spacing_x3 }}>
          <BrandText style={fontSemibold14}>{collection.desc}</BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: layout.spacing_x3,
            gap: layout.spacing_x1_5,
            flexWrap: "wrap",
          }}
        >
          <SocialButton
            text="Discord"
            iconSvg={discordSVG}
            onPress={() => Linking.openURL(collection.contact_discord_name)}
          />
          <SocialButton
            text="Twitter"
            iconSvg={twitterSVG}
            onPress={() => Linking.openURL(collection.twitter_profile)}
          />
          {collection.website_link && (
            <SocialButton
              text="Website"
              iconSvg={websiteSVG}
              onPress={() => Linking.openURL(collection.website_link!)}
            />
          )}
        </View>
        <SpacerColumn size={4} />
        <PrimaryButton text="Approve" boxStyle={{ width: 146 }} />
      </View>

      {width >= breakpointM ? (
        <SpacerRow size={3} />
      ) : (
        <SpacerColumn size={3} />
      )}

      {/* ===== Right container */}
      <Image
        resizeMode="contain"
        style={[
          {
            height: width >= breakpointM ? 534 : 380,
            width: width >= breakpointM ? 534 : 380,
          },
          width >= breakpointM && { flex: 1 },
        ]}
        source={guardianPng}
      />
    </View>
  );
};

const applicationCardCStyle: BoxStyle = { width: 132, maxWidth: 140 };
