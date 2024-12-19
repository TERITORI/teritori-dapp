import React from "react";
import { useWindowDimensions, View } from "react-native";

import { ApplicationCard } from "./ApplicationCard";

import { BrandText } from "@/components/BrandText";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const TeamInformation: React.FC<{
  collectionData: CollectionDataResult;
}> = ({ collectionData }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Team information</BrandText>
      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Team Description"
          value={collectionData.team_desc}
        />
        <ApplicationCard
          title="Partners Description"
          value={collectionData.partners}
        />
      </View>
    </View>
  );
};
