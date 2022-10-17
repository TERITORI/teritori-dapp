import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { ScreenFC } from "../../utils/navigation";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { LaunchpadBanner } from "./components/LaunchpadBanner";
import {
  LaunchpadButton,
  LaunchpadButtonProps,
} from "./components/LaunchpadButton";

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
    buttonTitle: "Coming soon",
  },
  {
    title: "My Collections",
    description: "Manage your collections with available actions and queries.",
    buttonTitle: "Open",
  },
];

export const LaunchpadScreen: ScreenFC<"Launchpad"> = () => {
  return (
    <ScreenContainer>
      <LaunchpadBanner />
      <SpacerColumn size={2} />
      <BrandText>Welcome</BrandText>
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
        <LaunchpadButton {...BUTTONS[1]} />
        <SpacerRow size={1.2} />
        <LaunchpadButton {...BUTTONS[2]} />
      </View>
    </ScreenContainer>
  );
};

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
