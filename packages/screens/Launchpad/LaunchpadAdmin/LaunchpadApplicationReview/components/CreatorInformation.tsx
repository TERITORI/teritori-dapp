import React from "react";
import { View, useWindowDimensions } from "react-native";

import { ApplicationCard } from "./ApplicationCard";

import { BrandText } from "@/components/BrandText";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import { CollectionDataResult } from "@/utils/types/launchpad";

export const CreatorInformation: React.FC<{
  creatorId: string;
  collectionData: CollectionDataResult;
}> = ({ creatorId, collectionData }) => {
  const { width } = useWindowDimensions();
  const creatorNSInfo = useNSUserInfo(creatorId);
  const [, creatorAddress] = parseUserId(creatorId);
  const creatorDisplayName =
    creatorNSInfo?.metadata?.tokenId || tinyAddress(creatorAddress);

  return (
    <View
      style={{
        paddingTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Creator information</BrandText>
      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
          flexWrap: "wrap",
        }}
      >
        <ApplicationCard title="Creator Name" value={creatorDisplayName} />
        <ApplicationCard
          title="Main Contact Email"
          value={collectionData.contact_email}
        />
      </View>
    </View>
  );
};
