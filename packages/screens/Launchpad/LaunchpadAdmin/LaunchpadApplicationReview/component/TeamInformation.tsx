import React from "react";
import { useWindowDimensions, View } from "react-native";

import { LinkCard } from "./LinkCard";

import { BrandText } from "@/components/BrandText";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { ApplicationCard } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const TeamInformation: React.FC<{
  collection: CollectionDataResult;
}> = ({ collection }) => {
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
          value={collection.team_desc}
        />
        <ApplicationCard
          title="Partners Description"
          value={collection.partners}
        />
        <LinkCard
          style={{ borderColor: "red" }}
          title="Team Links"
          linksData={[
            { title: "Instagram", link: "TODO" }, //TODO ?  We have only one input for these 3 data (external_link)
            { title: "Telegram", link: "TODO" }, //TODO ?
            { title: "Signal", link: "TODO" }, //TODO ?
          ]}
        />
      </View>
    </View>
  );
};
