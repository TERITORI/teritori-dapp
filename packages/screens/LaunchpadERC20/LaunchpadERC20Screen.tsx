import React from "react";
import { StyleSheet, View } from "react-native";

import LaunchpadERC20BannerImage from "@/assets/banners/launchpadERC20.jpg";
import { BrandText } from "@/components/BrandText";
import { ImageBackgroundLogoText } from "@/components/ImageBackgroundLogoText";
import { OmniLink } from "@/components/OmniLink";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import {
  LargeBoxButton,
  LargeBoxButtonProps,
} from "@/components/buttons/LargeBoxButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";

const BUTTONS: LargeBoxButtonProps[] = [
  {
    title: "Tokens",
    description: "Create your own ERC20 token with custom parameters.",
    buttonTitle: "Open",
  },
  {
    title: "Airdrops",
    description:
      "Create airdrops to engage with your community and distribute your tokens.",
    buttonTitle: "Open",
  },
  {
    title: "Sales",
    description:
      "Create private or public sales to distribute your tokens and raise funds.",
    buttonTitle: "Open",
  },
];

export const LaunchpadERC20Screen: ScreenFC<"LaunchpadERC20"> = () => {
  return (
    <ScreenContainer
      headerChildren={<ScreenTitle>Launchpad ERC 20</ScreenTitle>}
      forceNetworkFeatures={[NetworkFeature.LaunchpadERC20]}
      forceNetworkKind={NetworkKind.Gno}
    >
      <ImageBackgroundLogoText
        backgroundImage={LaunchpadERC20BannerImage}
        text="Launchpad ERC20 Platform"
      />

      <SpacerColumn size={2} />

      <BrandText style={fontSemibold28}>
        Welcome on the ERC20 Launchpad
      </BrandText>

      <SpacerColumn size={2} />

      <BrandText style={styles.descriptionText}>
        Looking to create your own ERC20 token? Look no further.
      </BrandText>

      <SpacerColumn size={2} />

      <BrandText style={styles.descriptionText}>
        Teritori provide a simple and efficient way to create your own ERC20
        token.
      </BrandText>
      <BrandText style={styles.descriptionText}>
        In few clicks, you can create your own tokens, airdrops and sales to
        engage with your community.
      </BrandText>

      <SpacerColumn size={4} />

      <View style={styles.buttonsContainer}>
        <OmniLink noHoverEffect to={{ screen: "LaunchpadERC20Tokens" }}>
          <LargeBoxButton {...BUTTONS[0]} />
        </OmniLink>

        <SpacerRow size={1.2} />

        <OmniLink noHoverEffect to={{ screen: "LaunchpadERC20Airdrops" }}>
          <LargeBoxButton {...BUTTONS[1]} />
        </OmniLink>

        <SpacerRow size={1.2} />

        <OmniLink noHoverEffect to={{ screen: "LaunchpadERC20Sales" }}>
          <LargeBoxButton {...BUTTONS[2]} />
        </OmniLink>
      </View>
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  descriptionText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
  buttonsContainer: {
    flexDirection: "row",
    flex: 1,
  },
});
