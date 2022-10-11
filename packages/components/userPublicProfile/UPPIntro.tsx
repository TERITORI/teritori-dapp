import React from "react";
import { Image, useWindowDimensions, View } from "react-native";

import defaultUserProfileImagePNG from "../../../assets/default-images/connected-image-bad.png";
import defaultUserProfileBannerPNG from "../../../assets/default-images/default-user-profile-banner.png";
import discordSVG from "../../../assets/icons/discord.svg";
import mediumSVG from "../../../assets/icons/medium.svg";
import shareSVG from "../../../assets/icons/share.svg";
import teritoriSVG from "../../../assets/icons/teritori.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { neutral77, withAlpha } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { CopyToClipboardSecondary } from "../CopyToClipboardSecondary";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SocialButton } from "../buttons/SocialButton";
import { SocialButtonSecondary } from "../buttons/SocialButtonSecondary";

export const UPPIntro: React.FC = () => {
  const { width } = useWindowDimensions();
  const socialButtonStyle = { marginHorizontal: 6, marginVertical: 6 };

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
          <SocialButton
            iconSvg={websiteSVG}
            text="Website"
            style={socialButtonStyle}
          />
          <SocialButton
            iconSvg={mediumSVG}
            text="Medium"
            style={socialButtonStyle}
          />
          <SocialButton
            iconSvg={discordSVG}
            text="Discord"
            style={socialButtonStyle}
          />
          <SocialButton
            iconSvg={twitterSVG}
            text="Twitter"
            style={socialButtonStyle}
          />
          {width > 670 && (
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
          )}
          <SocialButtonSecondary
            style={socialButtonStyle}
            iconSvg={shareSVG}
            text="Share"
          />
        </View>

        {/* Absolute user image */}
        <Image
          source={defaultUserProfileImagePNG}
          style={{
            height: 196,
            width: 196,
            position: "absolute",
            bottom: -100,
            left: 16,
          }}
        />
      </TertiaryBox>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 119,
        }}
      >
        <View>
          {/* Pseudo and bio */}
          <BrandText style={fontSemibold20}>Nickname</BrandText>
          <BrandText
            style={[
              fontSemibold14,
              { color: neutral77, marginTop: 12, marginBottom: 20 },
            ]}
          >
            {"Nickname is a creator of minimalistic/bold graphic and digital artwork.\n" +
              "Artist / Creative Director"}
          </BrandText>
          {/* Actions */}
          <View style={{ flexDirection: "row" }}>
            <PrimaryButton
              size="M"
              text="Follow"
              width={148}
              touchableStyle={{ marginRight: 16 }}
            />
            <SecondaryButton
              size="M"
              text="Send request to chat"
              width={180}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
          </View>
        </View>

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
            text="GxF34aBF3xC45...3A31"
            iconSVG={teritoriSVG}
          />
        </TertiaryBox>
      </View>
    </>
  );
};
