import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "@/components/BrandText";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { launchpadReviewBreakpointM } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/LaunchpadApplicationReviewScreen";
import { ApplicationCard } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";
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
        <ApplicationCard
          title="Creator Name"
          value={creatorDisplayName}
          style={{ flex: 2 }}
        />
        <ApplicationCard
          title="Twitter URL"
          // value={collectionData.twitter_profile}
          value="0"
          style={{ flex: 2 }}
        />

        <View
          style={{ flex: 2, flexDirection: "row", gap: layout.spacing_x1_5 }}
        >
          <ApplicationCard
            title="Twitter Follower Range"
            value="TODO" //TODO: ?
            style={{ flex: 1, borderColor: "red" }}
          />
          <ApplicationCard
            title="Twitter Follower Count"
            // value={collectionData.twitter_followers_count.toString()}
            value="0"
            style={{ flex: 1 }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: width >= launchpadReviewBreakpointM ? "row" : "column",
          marginTop: layout.spacing_x1_5,
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Main Contact Discord"
          // value={collectionData.contact_discord_name}
          value="TODO"
        />
        <ApplicationCard
          title="Discord URL"
          value="TODO" //TODO: ? We don't have input for this data
          style={{ borderColor: "red" }}
        />
        <ApplicationCard
          title="Main Contact Email"
          value={collectionData.contact_email}
        />
      </View>
    </View>
  );
};
