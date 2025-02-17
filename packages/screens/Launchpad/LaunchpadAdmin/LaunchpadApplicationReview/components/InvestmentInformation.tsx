import React from "react";
import { View, useWindowDimensions } from "react-native";

import { ApplicationCard } from "./ApplicationCard";
import { launchpadReviewBreakpointSM } from "../LaunchpadApplicationReviewScreen";

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
        paddingTop: layout.spacing_x4,
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
        <ApplicationCard
          title="Investment Links Attachments"
          value={collectionData.investment_link}
        />
      </View>
      {/*<View*/}
      {/*  style={{*/}
      {/*    flexDirection:*/}
      {/*      width >= launchpadReviewBreakpointSM ? "row" : "column",*/}
      {/*    marginVertical: layout.spacing_x2,*/}
      {/*    gap: layout.spacing_x1_5,*/}
      {/*    flexWrap: "wrap",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ApplicationCard*/}
      {/*    title="TeritoriDAO Allocated Whitelists"*/}
      {/*    value={collectionData.dao_whitelist_count.toString()}*/}
      {/*  />*/}
      {/*  <ApplicationCard*/}
      {/*    title="TeritoriDAO Allocated Whitelists"*/}
      {/*    value={collectionData.escrow_mint_proceeds_period.toString()}*/}
      {/*  />*/}
      {/*</View>*/}

      <ApplicationCard title="Partners" value={collectionData.partners} />
    </View>
  );
};
