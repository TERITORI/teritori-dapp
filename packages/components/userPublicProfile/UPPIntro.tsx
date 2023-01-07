import React from "react";
import { Image, Linking, useWindowDimensions, View } from "react-native";

import defaultUserProfileBannerPNG from "../../../assets/default-images/default-user-profile-banner.png";
import discordSVG from "../../../assets/icons/discord.svg";
import teritoriSVG from "../../../assets/icons/networks/teritori.svg";
import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77, withAlpha } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { useCopyToClipboard } from "../CopyToClipboard";
import { CopyToClipboardSecondary } from "../CopyToClipboardSecondary";
import { tinyAddress } from "../WalletSelector";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SocialButton } from "../buttons/SocialButton";
import { SocialButtonSecondary } from "../buttons/SocialButtonSecondary";
import { ProfileButton } from "../hub/ProfileButton";
import { UserImage } from "../images/UserImage";

export const UPPIntro: React.FC<{
  userId: string;
  isUserOwner?: boolean;
}> = ({ userId, isUserOwner }) => {
  const { metadata } = useNSUserInfo(userId);
  const { copyToClipboard } = useCopyToClipboard();
  const { width } = useWindowDimensions();
  const socialButtonStyle = { marginHorizontal: 6, marginVertical: 6 };
  const [network, userAddress] = parseUserId(userId);

  return (
    <>
      <TertiaryBox fullWidth height={320}>
        {/* Banner */}
        <Image
          source={{
            uri: ipfsURLToHTTPURL(
              metadata?.public_profile_header || defaultUserProfileBannerPNG
            ),
          }}
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
              onPress={() => Linking.openURL(metadata.external_url || "")}
            />
          )}
          {metadata?.discord_id && (
            <SocialButton
              iconSvg={discordSVG}
              text="Discord"
              style={socialButtonStyle}
              onPress={() => Linking.openURL(metadata.discord_id || "")}
            />
          )}
          {metadata?.twitter_id && (
            <SocialButton
              iconSvg={twitterSVG}
              text="Twitter"
              style={socialButtonStyle}
              onPress={() => Linking.openURL(metadata.twitter_id || "")}
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
          {/* This Share button link works only on web */}
          <SocialButtonSecondary
            style={socialButtonStyle}
            iconSvg={shareSVG}
            text="Share"
            onPress={() => copyToClipboard(window.location.href, "URL copied")}
          />
        </View>
        {isUserOwner && (
          <ProfileButton
            touchableStyle={{ position: "absolute", right: 20, bottom: -76 }}
            isEdit
          />
        )}
        <UserImage
          networkId={network?.id}
          imageURI={metadata?.image}
          style={{
            position: "absolute",
            top: 217,
            left: 16,
          }}
        >
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
        </UserImage>
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
              Coming Soon
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
              Coming Soon
            </BrandText>
            <BrandText style={[fontSemibold14]}>36</BrandText>
          </View>

          <CopyToClipboardSecondary
            displayedText={tinyAddress(userAddress, 19)}
            text={userAddress}
            iconSVG={teritoriSVG}
          />
        </TertiaryBox>
      </View>
    </>
  );
};
