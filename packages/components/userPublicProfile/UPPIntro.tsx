import React from "react";
import { Image, useWindowDimensions, View } from "react-native";

import defaultUserProfileBannerPNG from "../../../assets/default-images/default-user-profile-banner.png";
import discordSVG from "../../../assets/icons/discord.svg";
import teritoriSVG from "../../../assets/icons/networks/teritori.svg";
import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import userImageFrameSVG from "../../../assets/user-image-frame.svg";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral77, withAlpha } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CopyToClipboardSecondary } from "../CopyToClipboardSecondary";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { SocialButton } from "../buttons/SocialButton";
import { SocialButtonSecondary } from "../buttons/SocialButtonSecondary";

export const UPPIntro: React.FC<{
  userId: string;
  metadata?: Metadata & { tokenId: string };
}> = ({ userId, metadata }) => {
  const { width } = useWindowDimensions();
  const socialButtonStyle = { marginHorizontal: 6, marginVertical: 6 };
  const navigation = useAppNavigation();
  const name = (metadata?.tokenId || "").replace(process.env.TLD || "", "");

  return (
    <>
      <TertiaryBox fullWidth height={320}>
        {/* Banner */}
        <Image
          source={defaultUserProfileBannerPNG}
          style={{ height: "100%", width: "100%", borderRadius: 7 }}
        />

        {/* Absolute social buttons */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            position: "absolute",
            bottom: 14,
            right: 14,
          }}
        >
          {metadata?.external_url && (
            <SocialButton
              iconSvg={websiteSVG}
              text="Website"
              style={socialButtonStyle}
            />
          )}
          {metadata?.discord_id && (
            <SocialButton
              iconSvg={discordSVG}
              text="Discord"
              style={socialButtonStyle}
            />
          )}
          {metadata?.twitter_id && (
            <SocialButton
              iconSvg={twitterSVG}
              text="Twitter"
              style={socialButtonStyle}
            />
          )}
          {width > 670 &&
          (metadata?.twitter_id ||
            metadata?.discord_id ||
            metadata?.external_url) ? (
            <View
              style={[
                {
                  width: 1,
                  height: 24,
                  backgroundColor: withAlpha("#FFFFFF", 0.15),
                },
                socialButtonStyle,
              ]}
            />
          ) : null}
          <SocialButtonSecondary
            style={socialButtonStyle}
            iconSvg={shareSVG}
            text="Share"
          />
        </View>
        {/* Absolute edit button */}
        <SecondaryButtonOutline
          size="M"
          text="Edit profile"
          backgroundColor={neutral00}
          onPress={() => navigation.navigate("TNSUpdateName", { name })}
          touchableStyle={{ position: "absolute", right: 20, bottom: -76 }}
        />

        <View
          style={{
            position: "absolute",
            top: 217,
            left: 16,
          }}
        >
          {/* User image */}
          <Image
            source={{ uri: ipfsURLToHTTPURL(metadata?.image || "") }}
            style={{
              borderRadius: 24,
              height: 132,
              width: 132,
              position: "absolute",
              top: 32,
              left: 32,
              zIndex: 2,
            }}
          />
          <SVG source={userImageFrameSVG} width={196} height={196} />
          {/* Pseudo and bio */}
          <BrandText style={[fontSemibold20, { marginTop: 10 }]}>
            {metadata?.tokenId || ""}
          </BrandText>
          <BrandText
            numberOfLines={6}
            style={[
              fontSemibold14,
              {
                color: neutral77,
                marginTop: 12,
                marginBottom: 20,
                maxWidth: 1000,
              },
            ]}
          >
            {metadata?.public_bio || ""}
          </BrandText>
        </View>
      </TertiaryBox>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        {/* Stats and public address */}
        <TertiaryBox mainContainerStyle={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
              width: "100%",
            }}
          >
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Followers
            </BrandText>
            <BrandText style={[fontSemibold14]}>21.5k</BrandText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
              width: "100%",
            }}
          >
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Following
            </BrandText>
            <BrandText style={[fontSemibold14]}>36</BrandText>
          </View>

          <CopyToClipboardSecondary
            text={userId.replace("tori-", "")}
            iconSVG={teritoriSVG}
          />
        </TertiaryBox>
      </View>
    </>
  );
};
