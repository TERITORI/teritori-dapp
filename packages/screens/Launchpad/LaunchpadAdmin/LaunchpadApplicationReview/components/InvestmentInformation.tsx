import React from "react";
import { View, useWindowDimensions } from "react-native";

import { ApplicationCard } from "./ApplicationCard";
import { LinkCard } from "./LinkCard";

import { BrandText } from "@/components/BrandText";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const InvestmentInformation: React.FC<{
  collectionData: CollectionDataResult;
}> = ({ collectionData }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        paddingVertical: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Investment information</BrandText>
      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
          flexWrap: "wrap",
        }}
      >
        <ApplicationCard
          title="Investment Description"
          value={collectionData.investment_desc}
        />
        <LinkCard
          style={{ borderColor: "red" }}
          title="Investment Links Attachments"
          linksData={[
            { title: "Instagram", link: "TODO" }, //TODO ? We have only one input for these 3 data
            { title: "Telegram", link: "TODO" }, //TODO ?
            { title: "Signal", link: "TODO" }, //TODO ?
          ]}
        />
        <LinkCard
          style={{ borderColor: "red" }}
          title="Whitepaper Roadmap"
          linksData={[
            { title: "Roadmap", link: "TODO" }, //TODO ?   We have only one input for these 3 data
            { title: "Whitepaper", link: "TODO" }, //TODO ?
            { title: "Pitch Deck", link: "TODO" }, //TODO ?
          ]}
        />
      </View>
    </View>
  );
};
