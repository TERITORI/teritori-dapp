import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BoxDetailTeritori } from "@/components/BoxDetailTeritori/BoxDetailTeritori";
import { BrandText } from "@/components/BrandText";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import {CollectionDataResult} from "@/utils/types/launchpad";

const MD_BREAKPOINT = 800;

export const CreatorInformation: React.FC<{
  collection: CollectionDataResult;
}> = ({collection}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        borderTopColor: neutral33,
        borderTopWidth: 1,
        paddingTop: 32,
      }}
    >
      <BrandText style={fontSemibold20}>Creator information</BrandText>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <BoxDetailTeritori title="Creator Name" descripation="@nickname" />
        <BoxDetailTeritori title="Creator Name" descripation="@nickname" />

        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <BoxDetailTeritori
            title="Twitter Follower Range"
            descripation="5000"
          />
          <BoxDetailTeritori
            title="Twitter Follower Count"
            descripation="5000"
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          marginTop: 12,
          gap: 12,
        }}
      >
        <BoxDetailTeritori
          title="Main Contact Discord"
          descripation="@nickname"
        />
        <BoxDetailTeritori
          title="Discord URL"
          descripation="https://discord.com/link"
        />
        <BoxDetailTeritori
          title="Main Contact Email"
          descripation="hello@email.com"
        />
      </View>
    </View>
  );
};
