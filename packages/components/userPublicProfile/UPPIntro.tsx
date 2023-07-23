import React from "react";
import { Linking, useWindowDimensions, View } from "react-native";

import defaultUserProfileBannerPNG from "../../../assets/default-images/default-user-profile-banner.png";
import discordSVG from "../../../assets/icons/discord.svg";
import shareSVG from "../../../assets/icons/share.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { DEFAULT_NAME } from "../../utils/social-feed";
import { neutral00, neutral55, neutral77 } from "../../utils/style/colors";
import {
  fontBold16,
  fontMedium14,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { useCopyToClipboard } from "../CopyToClipboard";
import { CopyToClipboardSecondary } from "../CopyToClipboardSecondary";
import { OptimizedImage } from "../OptimizedImage";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { SocialButton } from "../buttons/SocialButton";
import { SocialButtonSecondary } from "../buttons/SocialButtonSecondary";
import { ProfileButton } from "../hub/ProfileButton";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

export const UPPIntro: React.FC<{
  userId: string;
  isUserOwner?: boolean;
}> = ({ userId, isUserOwner }) => {
  const { metadata } = useNSUserInfo(userId);
  const { copyToClipboard } = useCopyToClipboard();
  const socialButtonStyle = { margin: layout.spacing_x0_75 };
  const [network, userAddress] = parseUserId(userId);
  const { width } = useMaxResolution();
  const { width: windowWidth } = useWindowDimensions();

  return (
    <>
      <TertiaryBox
        height={320}
        noBrokenCorners={windowWidth < RESPONSIVE_BREAKPOINT_S}
        mainContainerStyle={
          windowWidth < RESPONSIVE_BREAKPOINT_S && { borderRadius: 0 }
        }
        width={windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width}
      >
        {/* Banner */}
        <OptimizedImage
          width={windowWidth < RESPONSIVE_BREAKPOINT_S ? windowWidth : width}
          height={320}
          sourceURI={metadata?.public_profile_header}
          fallbackURI={defaultUserProfileBannerPNG}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: windowWidth < RESPONSIVE_BREAKPOINT_S ? 0 : 7,
          }}
        />

        {/* Absolute social buttons */}
        <View
          style={{
            flexDirection:
              windowWidth < RESPONSIVE_BREAKPOINT_S ? "column" : "row",
            alignItems: "center",
            position: "absolute",
            bottom: 14,
            right: 14,
          }}
        >
          {!!metadata?.external_url && (
            <SocialButton
              iconSvg={websiteSVG}
              text="Website"
              style={socialButtonStyle}
              onPress={() => Linking.openURL(metadata.external_url || "")}
            />
          )}
          {!!metadata?.discord_id && (
            <SocialButton
              iconSvg={discordSVG}
              text="Discord"
              style={socialButtonStyle}
              onPress={() => Linking.openURL(metadata.discord_id || "")}
            />
          )}
          {!!metadata?.twitter_id && (
            <SocialButton
              iconSvg={twitterSVG}
              text="Twitter"
              style={socialButtonStyle}
              onPress={() => Linking.openURL(metadata.twitter_id || "")}
            />
          )}
          {/* This Share button link works only on web */}
          <SocialButtonSecondary
            style={socialButtonStyle}
            iconSvg={shareSVG}
            text="Share"
            onPress={() => copyToClipboard(window?.location.href, "URL copied")}
          />
        </View>
        {isUserOwner ? (
          <ProfileButton
            style={{ position: "absolute", right: 0, bottom: -80 }}
            isEdit
          />
        ) : (
          <SecondaryButtonOutline
            touchableStyle={{ position: "absolute", right: 0, bottom: -80 }}
            text="Follow this Teritori"
            size="XL"
            backgroundColor={neutral00}
            disabled
          />
        )}
        <UserAvatarWithFrame
          userId={userId}
          style={{
            position: "absolute",
            top: 217,
            left: 16,
          }}
          size="XL"
        />
      </TertiaryBox>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <View style={{ marginBottom: layout.spacing_x1 }}>
          {/* Pseudo and bio */}
          {metadata?.tokenId ? (
            <>
              <BrandText style={[fontBold16]}>
                {metadata?.public_name}
              </BrandText>
              <BrandText
                style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              >
                @{metadata.tokenId}
              </BrandText>
            </>
          ) : (
            <>
              <BrandText style={[fontBold16]}>{DEFAULT_NAME}</BrandText>
              <BrandText
                style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              >
                @{userAddress}
              </BrandText>
            </>
          )}
          <BrandText
            style={[
              fontMedium14,
              { maxWidth: 735, marginTop: layout.spacing_x1 },
            ]}
          >
            {metadata?.public_bio}
          </BrandText>
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
            networkIcon={network?.id}
          />
        </TertiaryBox>
      </View>
    </>
  );
};
