import React from "react";
import { Linking } from "react-native";

import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { SocialButton } from "../buttons/SocialButton";

export const CollectionSocialButtons: React.FC<{
  discordLink?: string;
  websiteLink?: string;
  twitterLink?: string;
}> = ({ discordLink, websiteLink, twitterLink }) => {
  return (
    <>
      {discordLink && (
        <SocialButton
          text="Discord"
          iconSvg={discordSVG}
          style={{ marginRight: 12 }}
          onPress={() => Linking.openURL(discordLink)}
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
