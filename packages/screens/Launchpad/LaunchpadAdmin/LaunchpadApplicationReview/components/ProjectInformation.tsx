import React from "react";
import { useWindowDimensions, View } from "react-native";

import { ApplicationCard } from "./ApplicationCard";
import {
  launchpadReviewBreakpointS,
  launchpadReviewBreakpointSM,
} from "../LaunchpadApplicationReviewScreen";

import { BrandText } from "@/components/BrandText";
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
      <BrandText style={[fontSemibold20, { marginBottom: layout.spacing_x2 }]}>
        Project information
      </BrandText>
      <ApplicationCard
        title="Project Description"
        value={collectionData.desc}
      />

      <ApplicationCard
        title="Artwork Description"
        value={collectionData.artwork_desc}
        style={{ marginTop: layout.spacing_x2 }}
      />

      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointS ? "row" : "column",
          marginVertical: layout.spacing_x2,
          flexWrap: "wrap",
          gap: layout.spacing_x1_5,
        }}
      >
        {/*<View*/}
        {/*  style={{*/}
        {/*    flexDirection:*/}
        {/*      width >= launchpadReviewBreakpointSM ? "row" : "column",*/}
        {/*    flexWrap: "wrap",*/}
        {/*    flex: 1,*/}
        {/*    gap: layout.spacing_x1_5,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <ApplicationCard*/}
        {/*    title="Previous Apply"*/}
        {/*    value={collectionData.is_applied_previously ? "Yes" : "No"}*/}
        {/*    style={{ maxHeight: 64 }}*/}
        {/*  />*/}
        {/*  <ApplicationCard*/}
        {/*    title="Doxed"*/}
        {/*    value={collectionData.is_dox ? "Yes" : "No"}*/}
        {/*    style={{ maxHeight: 64 }}*/}
        {/*  />*/}
        {/*</View>*/}

      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection:*/}
      {/*        width >= launchpadReviewBreakpointSM ? "row" : "column",*/}
      {/*      flexWrap: "wrap",*/}
      {/*      flex: 1,*/}
      {/*      gap: layout.spacing_x1_5,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <ApplicationCard*/}
      {/*      title="Derivative"*/}
      {/*      value={collectionData.is_project_derivative ? "Yes" : "No"}*/}
      {/*      style={{ maxHeight: 64 }}*/}
      {/*    />*/}
      {/*    <ApplicationCard*/}
      {/*      title="Ready for Mint"*/}
      {/*      value={collectionData.is_ready_for_mint ? "Yes" : "No"}*/}
      {/*      style={{ maxHeight: 64 }}*/}
      {/*    />*/}
      {/*  </View>*/}
      </View>

      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointS ? "row" : "column",
          // marginTop: layout.spacing_x2,
          flexWrap: "wrap",
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Website Link"
          value={collectionData.website_link}
        />
        <ApplicationCard
          title="Project Type"
          value={collectionData.project_type.replace(",", ", ")}
        />
      </View>
    </View>
  );
};
