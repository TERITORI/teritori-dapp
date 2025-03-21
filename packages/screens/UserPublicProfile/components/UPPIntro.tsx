import React, { useState } from "react";
import { Linking, Platform, useWindowDimensions, View } from "react-native";

import { PremiumSubscriptionModal } from "./modals/PremiumSubscriptionModal";
import { SubscriptionSetupModal } from "./modals/SubscriptionSetupModal";

import defaultUserProfileBannerPNG from "@/assets/default-images/default-user-profile-banner.png";
import discordSVG from "@/assets/icons/discord.svg";
import infoSVG from "@/assets/icons/info_black.svg";
import shareSVG from "@/assets/icons/share.svg";
import websiteSVG from "@/assets/icons/website.svg";
import twitterSVG from "@/assets/icons/x-logo.svg";
import { BrandText } from "@/components/BrandText";
import { useCopyToClipboard } from "@/components/CopyToClipboard";
import { CopyToClipboardSecondary } from "@/components/CopyToClipboardSecondary";
import { OptimizedImage } from "@/components/OptimizedImage";
import { LegacyTertiaryBox } from "@/components/boxes/LegacyTertiaryBox";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SecondaryButtonOutline } from "@/components/buttons/SecondaryButtonOutline";
import { SocialButton } from "@/components/buttons/SocialButton";
import { SocialButtonSecondary } from "@/components/buttons/SocialButtonSecondary";
import { ProfileButton } from "@/components/hub/ProfileButton";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { useIsDAO } from "@/hooks/cosmwasm/useCosmWasmContractInfo";
import { useDAOKind } from "@/hooks/dao/useDAOKind";
import { usePremiumChannel } from "@/hooks/feed/usePremiumChannel";
import { usePremiumIsSubscribed } from "@/hooks/feed/usePremiumIsSubscribed";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  accountExplorerLink,
  getNetworkFeature,
  NetworkFeature,
  NetworkKind,
  parseUserId,
} from "@/networks";
import { DEFAULT_NAME } from "@/utils/social-feed";
import {
  neutral00,
  neutral55,
  neutralA3,
  secondaryColor,
  yellowPremium,
} from "@/utils/style/colors";
import { fontBold16, fontMedium14, fontSemibold12 } from "@/utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { normalizeTwitterId } from "@/utils/twitter";

export const UPPIntro: React.FC<{
  userId: string;
  isUserOwner?: boolean;
  setIsEditProfileModal?: (val: boolean) => void;
}> = ({ userId, isUserOwner, setIsEditProfileModal = (val) => {} }) => {
  const selectedWallet = useSelectedWallet();
  const { metadata } = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);
  const { daoKind } = useDAOKind(userId);
  const { copyToClipboard } = useCopyToClipboard();
  const socialButtonStyle = { margin: layout.spacing_x0_75 };
  const [network, userAddress] = parseUserId(userId);
  const { width } = useMaxResolution({ isLarge: true });
  const { width: windowWidth } = useWindowDimensions();
  const { data: premiumChannel } = usePremiumChannel(network?.id, userAddress);
  const networkHasPremiumFeature = !!getNetworkFeature(
    network?.id,
    NetworkFeature.CosmWasmPremiumFeed,
  );

  const { data: isSubscribed } = usePremiumIsSubscribed(
    userId,
    selectedWallet?.userId,
  );

  const [subscriptionSetupModalVisible, setSubscriptionSetupModalVisible] =
    useState(false);
  const [premiumSubscriptionModalVisible, setPremiumSubscriptionModalVisible] =
    useState(false);

  return (
    <>
      <LegacyTertiaryBox
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
            objectFit: "cover",
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
            right: Platform.OS === "web" ? 14 : 34,
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
              style={socialButtonStyle}
              onPress={() => {
                if (!metadata.twitter_id) return;
                Linking.openURL(normalizeTwitterId(metadata.twitter_id));
              }}
            />
          )}
          {network?.kind === NetworkKind.Gno && (
            <SocialButtonSecondary
              iconSvg={infoSVG}
              text="Gnoweb"
              style={socialButtonStyle}
              onPress={() =>
                Linking.openURL(
                  `${network.gnowebURL}${userAddress.startsWith("gno.land/") ? userAddress.substring("gno.land".length) : `/r/${network.cockpitNamespace || "teritori"}/cockpit:u/${userAddress}`}`,
                )
              }
            />
          )}
          <SocialButtonSecondary
            iconSvg={infoSVG}
            text="Explorer"
            style={socialButtonStyle}
            onPress={() =>
              Linking.openURL(accountExplorerLink(network?.id, userAddress))
            }
          />
          {/* This Share button link works only on web */}
          {Platform.OS === "web" && (
            <SocialButtonSecondary
              style={socialButtonStyle}
              iconSvg={shareSVG}
              text="Share"
              onPress={() =>
                copyToClipboard(window.location.href, "URL copied")
              }
            />
          )}
        </View>

        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: -80,
            flexDirection: "row",
          }}
        >
          {isUserOwner ? (
            <>
              {!!networkHasPremiumFeature && (
                <>
                  <SecondaryButton
                    style={{ marginRight: layout.spacing_x2 }}
                    text="Premium Channel"
                    size="M"
                    hoverBorderColor={yellowPremium}
                    paddingHorizontal={layout.spacing_x2}
                    backgroundColor={secondaryColor}
                    textStyle={{
                      lineHeight: layout.spacing_x2,
                      color: neutral00,
                    }}
                    onPress={() => {
                      setSubscriptionSetupModalVisible(true);
                    }}
                  />
                  <SubscriptionSetupModal
                    userId={userId}
                    onClose={() => setSubscriptionSetupModalVisible(false)}
                    isVisible={subscriptionSetupModalVisible}
                  />
                </>
              )}
              <ProfileButton
                isEdit
                buttonSize="M"
                setIsEditProfileModal={(val: boolean) => {
                  setIsEditProfileModal(val);
                }}
              />
            </>
          ) : (
            <>
              {!!premiumChannel && (
                <>
                  {isSubscribed ? (
                    <SecondaryButtonOutline
                      style={{ marginRight: layout.spacing_x2 }}
                      text="Subscribed"
                      size="M"
                      backgroundColor={neutral00}
                      disabled
                    />
                  ) : (
                    <SecondaryButton
                      style={{ marginRight: layout.spacing_x2 }}
                      text="Premium Sub"
                      size="M"
                      hoverBorderColor={yellowPremium}
                      paddingHorizontal={layout.spacing_x2}
                      backgroundColor={secondaryColor}
                      textStyle={{
                        lineHeight: layout.spacing_x2,
                        color: neutral00,
                      }}
                      onPress={() => {
                        if (isUserOwner) {
                          setSubscriptionSetupModalVisible(true);
                        } else {
                          setPremiumSubscriptionModalVisible(true);
                        }
                      }}
                    />
                  )}
                </>
              )}
              <PremiumSubscriptionModal
                onClose={() => setPremiumSubscriptionModalVisible(false)}
                isVisible={premiumSubscriptionModalVisible}
                userId={userId}
              />
              <SecondaryButtonOutline
                text="Follow this Teritori"
                size="M"
                backgroundColor={neutral00}
                disabled
              />
            </>
          )}
        </View>

        <UserAvatarWithFrame
          userId={userId}
          style={{
            position: "absolute",
            top: 217,
            left: 16,
          }}
          size="XL"
        />
      </LegacyTertiaryBox>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 100,
          marginBottom: layout.spacing_x1,
        }}
      >
        <View>
          <>
            <BrandText style={[fontBold16]} testID="upp-display-name">
              {metadata?.public_name || DEFAULT_NAME}
            </BrandText>
            <BrandText
              style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              testID="upp-username"
            >
              @{metadata.tokenId || userAddress}
            </BrandText>
          </>
          {isDAO && daoKind && (
            <View
              style={[
                {
                  marginTop: layout.spacing_x1,
                  justifyContent: "center",
                  borderRadius: 4,
                  backgroundColor: "#1C1C1C",
                  height: 18,
                  paddingHorizontal: 4,
                  alignSelf: "flex-start",
                },
              ]}
            >
              <BrandText
                style={[
                  fontSemibold12,
                  {
                    color: neutralA3,
                  },
                ]}
              >
                {daoKind}
              </BrandText>
            </View>
          )}
          <BrandText
            style={[
              fontMedium14,
              { maxWidth: 735, marginTop: layout.spacing_x1 },
            ]}
            testID="upp-bio"
          >
            {metadata?.public_bio}
          </BrandText>
        </View>
        {/* Stats and public address */}
        <CopyToClipboardSecondary
          displayedText={tinyAddress(userAddress, 19)}
          text={userAddress}
          networkIcon={network?.id}
        />
      </View>
    </>
  );
};
