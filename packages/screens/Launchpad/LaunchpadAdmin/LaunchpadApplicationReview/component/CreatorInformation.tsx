import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "@/components/BrandText";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import {CollectionDataResult} from "@/utils/types/launchpad";
import {layout} from "@/utils/style/layout";
import {ApplicationCard} from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadApplicationReview/component/ApplicationCard";

const breakpointM = 768;

export const CreatorInformation: React.FC<{
  collection: CollectionDataResult;
}> = ({collection}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        borderTopColor: neutral33,
        borderTopWidth: 1,
        paddingTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontSemibold20}>Creator information</BrandText>
      <View
        style={{
          flexDirection: width >= breakpointM ? "row" : "column",
          marginTop: layout.spacing_x2,
          gap: layout.spacing_x1_5,
          flexWrap: "wrap",
        }}
      >
        <ApplicationCard title="Creator Name" value="@nickname" style={{flex: 2}}/>
        <ApplicationCard title="Twitter URL" value="@nickname" style={{flex: 2}}/>

        <View style={{ flex: 2, flexDirection: "row", gap: layout.spacing_x1_5 }}>
          <ApplicationCard
            title="Twitter Follower Range"
            value="5000"
          />
          <ApplicationCard
            title="Twitter Follower Count"
            value="5000"
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: width >= breakpointM ? "row" : "column",
          marginTop: layout.spacing_x1_5,
          gap: layout.spacing_x1_5,
        }}
      >
        <ApplicationCard
          title="Main Contact Discord"
          value="@nickname"
        />
        <ApplicationCard
          title="Discord URL"
          value="https://discord.com/link"
        />
        <ApplicationCard
          title="Main Contact Email"
          value="hello@email.com"
        />
      </View>
    </View>
  );
};
