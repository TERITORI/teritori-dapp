import React from "react";
import { Linking, TextStyle, View } from "react-native";

import { LaunchpadBanner } from "./LaunchpadCreate/components/LaunchpadBanner";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  LargeBoxButton,
  LargeBoxButtonProps,
} from "../../../components/buttons/LargeBoxButton";

import { BrandText } from "@/components/BrandText";
import { OmniLink } from "@/components/OmniLink";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn } from "@/components/spacer";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { NetworkFeature } from "@/networks";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const MD_BREAKPOINT = 720;

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
    buttonTitle: "Open",
  },
  {
    title: "My Collections",
    description: "Manage your collections with available actions and queries.",
    buttonTitle: "Open",
  },
];

export const LaunchpadApplyScreen: ScreenFC<"LaunchpadApply"> = () => {
  const { width } = useMaxResolution();
  return (
    <ScreenContainer
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      headerChildren={
        <BrandText style={fontSemibold20}>Apply to Launchpad</BrandText>
      }
    >
      <LaunchpadBanner />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold28}>Welcome</BrandText>
      <SpacerColumn size={2} />
      <BrandText style={descriptionTextCStyle}>
        Looking for a fast and efficient way to build an NFT collection?
      </BrandText>
      <SpacerColumn size={2} />
      <BrandText style={descriptionTextCStyle}>
        Teritori is the solution. Teritori is built to provide useful smart
        contract interfaces that helps you build and deploy your own NFT
        collections in no time.
      </BrandText>
      <SpacerColumn size={4} />

      <View
        style={{
          flexDirection: width < MD_BREAKPOINT ? "column" : "row",
        }}
      >
        <CustomPressable
          onPress={() =>
            Linking.openURL("https://airtable.com/shr1kU7kXW0267gNV")
          }
          style={{ flex: 1 }}
        >
          <LargeBoxButton {...BUTTONS[0]} />
        </CustomPressable>

        <OmniLink
          noHoverEffect
          to={{ screen: "LaunchpadCreate" }}
          style={{
            flex: 1,
            marginHorizontal: width >= MD_BREAKPOINT ? layout.spacing_x1_5 : 0,
            marginVertical: width >= MD_BREAKPOINT ? 0 : layout.spacing_x1_5,
          }}
        >
          <LargeBoxButton {...BUTTONS[1]} />
        </OmniLink>

        <OmniLink
          noHoverEffect
          to={{ screen: "LaunchpadMyCollections" }}
          style={{ flex: 1 }}
        >
          <LargeBoxButton {...BUTTONS[2]} />
        </OmniLink>
      </View>
    </ScreenContainer>
  );
};

const descriptionTextCStyle: TextStyle = {
  ...fontSemibold14,
  color: neutral77,
};
