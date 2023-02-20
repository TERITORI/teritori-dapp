import React from "react";
import { Linking, useWindowDimensions } from "react-native";

import discordSVG from "../../../assets/icons/discord.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import websiteSVG from "../../../assets/icons/website.svg";
import { CollectionInfo } from "../../hooks/useCollectionInfo";
import { SocialButton } from "../buttons/SocialButton";

export const CollectionSocialButtons: React.FC<{
  collectionInfo: CollectionInfo;
}> = ({ collectionInfo }) => {
  const {
    discord: discordLink,
    twitter: twitterLink,
    website: websiteLink,
  } = collectionInfo;
  const { width } = useWindowDimensions();

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
          style={{ marginRight: width < 868 ? 0 : 12 }}
          onPress={() => Linking.openURL(twitterLink)}
        />
      )}
    </>
  );
};
