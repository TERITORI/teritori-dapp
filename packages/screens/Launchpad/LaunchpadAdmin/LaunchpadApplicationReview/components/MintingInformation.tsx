import moment from "moment";
import React, { Fragment } from "react";
import { useWindowDimensions, View } from "react-native";

import { ApplicationCard } from "./ApplicationCard";
import { launchpadReviewBreakpointSM } from "../LaunchpadApplicationReviewScreen";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionDataResult,
  MintPeriodDataResult,
} from "@/utils/types/launchpad";

export const MintingInformation: React.FC<{
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
        Minting Information
      </BrandText>

      <ApplicationCard
        title="Reveal Time"
        value={
          !collectionData.reveal_time
            ? "As soon as possible"
            : moment.utc(collectionData.reveal_time).format("DD/MM/YYYY")
        }
      />

      {collectionData.royalty_address && collectionData.royalty_percentage && (
        <View
          style={{
            flexDirection:
              width >= launchpadReviewBreakpointM ? "row" : "column",
            marginTop: layout.spacing_x2,
            flexWrap: "wrap",
            gap: layout.spacing_x1_5,
          }}
        >
          {collectionData.royalty_address && (
            <ApplicationCard
              title="Payment Address"
              value={collectionData.royalty_address}
            />
          )}
          {collectionData.royalty_percentage && (
            <ApplicationCard
              title="Shared Percentage"
              value={collectionData.royalty_percentage}
            />
          )}
        </View>
      )}

      {collectionData.mint_periods.map((mintPeriod, index) => {
        return (
          <>
            <Fragment key={index}>
              <SpacerColumn size={4} />
              <MintPeriod index={index} mintPeriod={mintPeriod} />
            </Fragment>
          </>
        );
      })}
    </View>
  );
};

const MintPeriod: React.FC<{
  mintPeriod: MintPeriodDataResult;
  index: number;
}> = ({ mintPeriod, index }) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <BrandText
        style={fontSemibold20}
      >{`Minting Period #${index + 1}`}</BrandText>

      {mintPeriod.price && (
        <View
          style={{
            flexDirection:
              width >= launchpadReviewBreakpointSM ? "row" : "column",
            marginTop: layout.spacing_x2,
            flexWrap: "wrap",
            gap: layout.spacing_x1_5,
          }}
        >
          <ApplicationCard title="Amount" value={mintPeriod.price.amount} />
          <ApplicationCard
            title="Denom"
            value={mintPeriod.price.denom.toString()}
          />
        </View>
      )}

      <View
        style={{
          flexDirection:
            width >= launchpadReviewBreakpointSM ? "row" : "column",
          marginTop: layout.spacing_x2,
          flexWrap: "wrap",
          gap: layout.spacing_x1_5,
        }}
      >
        {mintPeriod.max_tokens && (
          <ApplicationCard
            title="Max tokens"
            value={mintPeriod.max_tokens.toString()}
          />
        )}
        {mintPeriod.limit_per_address && (
          <ApplicationCard
            title="Per address Limit"
            value={mintPeriod.limit_per_address.toString()}
          />
        )}
      </View>

      <View
        style={{
          flexDirection:
            width >= launchpadReviewBreakpointSM ? "row" : "column",
          marginTop: layout.spacing_x2,
          flexWrap: "wrap",
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Start Time"
          value={moment.utc(mintPeriod.start_time).format("DD/MM/YYYY")}
        />
        {mintPeriod.end_time && (
          <ApplicationCard
            title="End Time"
            value={moment.utc(mintPeriod.end_time).format("DD/MM/YYYY")}
          />
        )}
      </View>
    </>
  );
};
