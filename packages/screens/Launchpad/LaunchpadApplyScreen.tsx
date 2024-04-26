import React from "react";
import { StyleSheet, View } from "react-native";

import { LaunchpadBanner } from "./LaunchpadCreate/components/LaunchpadBanner";
import {
  LaunchpadButton,
  LaunchpadButtonProps,
} from "./LaunchpadCreate/components/LaunchpadButton";

import { BrandText } from "@/components/BrandText";
import { OmniLink } from "@/components/OmniLink";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";

const BUTTONS: LaunchpadButtonProps[] = [
  {
    title: "Candidate",
    description: "Pitch your project to launchpad managers & community.",
    buttonTitle: "Open",
  },
  {
    title: "Create",
    description:
      "Upload your assets, enter collection metadata and deploy your collection.",
    buttonTitle: "Open",
  },
  {
    title: "My Collections",
    description: "Manage your collections with available actions and queries.",
    buttonTitle: "Open",
  },
];

export const LaunchpadApplyScreen: ScreenFC<"LaunchpadApply"> = () => {
  return (
    <ScreenContainer
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      headerChildren={
        <BrandText style={fontSemibold20}>NFT Launchpad</BrandText>
      }
    >
      <LaunchpadBanner />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold28}>Welcome</BrandText>
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
        <LaunchpadButton
          {...BUTTONS[0]}
          url="https://airtable.com/shr1kU7kXW0267gNV"
        />
        <SpacerRow size={1.2} />
        <OmniLink noHoverEffect to={{ screen: "LaunchpadCreate" }}>
          <LaunchpadButton {...BUTTONS[1]} />
        </OmniLink>
        <SpacerRow size={1.2} />
        <OmniLink noHoverEffect to={{ screen: "LaunchpadMyCollections" }}>
          <LaunchpadButton {...BUTTONS[2]} />
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
