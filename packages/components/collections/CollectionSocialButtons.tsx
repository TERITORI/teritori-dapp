import React from "react";
import { Linking } from "react-native";

import coin from "../../../assets/icons/coin.svg";
import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { CollectionInfo } from "../../utils/collection";
import { SocialButton } from "../buttons/SocialButton";

export const CollectionSocialButtons: React.FC<{
  collectionInfo: CollectionInfo;
  hideMintButton?: boolean;
}> = ({ collectionInfo, hideMintButton }) => {
  const {
    discord: discordLink,
    twitter: twitterLink,
    website: websiteLink,
    isMintable,
  } = collectionInfo;

  return (
    <>
      {isMintable && !hideMintButton && (
        <SocialButton
          text="Mintable"
          iconSvg={coin}
          style={{ marginRight: 12 }}
          onPress={() => Linking.openURL(window?.location?.href + "/mint")}
        />
      )}
      {websiteLink && (
        <SocialButton
          text="Website"
          iconSvg={websiteSVG}
          style={{ marginRight: 12 }}
          onPress={() => Linking.openURL(websiteLink)}
        />
      )}
      {discordLink && (
        <SocialButton
          text="Discord"
          iconSvg={discordSVG}
          style={{ marginRight: 12 }}
          onPress={() => Linking.openURL(discordLink)}
        />
      )}
      {twitterLink && (
        <SocialButton
          text="Twitter"
          iconSvg={twitterSVG}
          style={{ marginRight: 12 }}
          onPress={() => Linking.openURL(twitterLink)}
        />
      )}
    </>
  );
};
