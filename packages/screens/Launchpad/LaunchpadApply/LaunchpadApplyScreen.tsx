import React from "react";
import { StyleSheet, View } from "react-native";

import LaunchpadBannerImage from "@/assets/banners/launchpad.jpg";
import { BrandText } from "@/components/BrandText";
import { ImageBackgroundLogoText } from "@/components/ImageBackgroundLogoText";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  LargeBoxButton,
  LargeBoxButtonProps,
} from "@/components/buttons/LargeBoxButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontRegular14, fontRegular28 } from "@/utils/style/fonts";

const BUTTONS: LargeBoxButtonProps[] = [
  {
    title: "Candidate",
    description: "Pitch your project to launchpad managers & community.",
    buttonTitle: "Open",
  },
  {
    title: "Create",
    description:
      "Upload your assets, enter collection metadata and deploy your collection.",
    buttonTitle: "Coming soon",
  },
  {
    title: "My Collections",
    description: "Manage your collections with available actions and queries.",
    buttonTitle: "Coming soon",
  },
];

export const LaunchpadApplyScreen: ScreenFC<"LaunchpadApply"> = () => {
  return (
    <ScreenContainer responsive isLarge>
      <ImageBackgroundLogoText
        backgroundImage={LaunchpadBannerImage}
        text="Apply to Launchpad"
      />
      <SpacerColumn size={2} />
      <BrandText style={fontRegular28}>Welcome</BrandText>
      <SpacerColumn size={2} />
      <BrandText style={styles.descriptionText}>
        Looking for a fast and efficient way to build an NFT collection?
      </BrandText>
      <SpacerColumn size={2} />
      <BrandText style={styles.descriptionText}>
        Teritori is the solution. Teritori is built to provide useful smart
        contract interfaces that helps you build and deploy your own NFT
        collections in no time.
      </BrandText>
      <SpacerColumn size={4} />
      <View style={styles.buttonsContainer}>
        <LargeBoxButton
          {...BUTTONS[0]}
          url="https://airtable.com/shr1kU7kXW0267gNV"
        />
        <SpacerRow size={1.2} />
        <LargeBoxButton {...BUTTONS[1]} />
        <SpacerRow size={1.2} />
        <LargeBoxButton {...BUTTONS[2]} />
      </View>
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  descriptionText: StyleSheet.flatten([fontRegular14, { color: neutral77 }]),
  buttonsContainer: { flexDirection: "row", flex: 1 },
});
