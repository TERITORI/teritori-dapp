import React from "react";
import { useWindowDimensions, View } from "react-native";

import { LinkCard } from "./LinkCard";

import { BrandText } from "@/components/BrandText";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { ApplicationCard } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const ProjectInformation: React.FC<{
  collectionData: CollectionDataResult;
}> = ({ collectionData }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Project information</BrandText>
      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          flexWrap: "wrap",
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Project Description"
          value={collectionData.project_desc}
        />
        <LinkCard
          title="Other Links"
          linksData={[
            { title: "Instagram", link: "TODO" }, //TODO: ?   We have only one input for these 3 data (external_link)
            { title: "Telegram", link: "TODO" }, //TODO: ?
            { title: "Signal", link: "TODO" }, //TODO: ?
          ]}
          style={{ borderColor: "red" }}
        />
        <View style={{ flex: 1, gap: layout.spacing_x1_5 }}>
          <ApplicationCard
            title="Previous Apply"
            value={collectionData.is_applied_previously ? "Yes" : "No"}
          />
          <ApplicationCard
            title="Previous Type"
            value="TODO"
            style={{ borderColor: "red" }} //TODO: ?  We don't have inout for this data
          />
        </View>
      </View>
    </View>
  );
};
