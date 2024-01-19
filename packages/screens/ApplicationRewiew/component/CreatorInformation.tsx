import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { BoxDetailTeriroy } from "../../../components/boxDetailTeriroy/BoxDetailTeriroy";
import { neutral33 } from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";

const MD_BREAKPOINT = 800;

export const CreatorInformation: React.FC = () => {
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
        <BoxDetailTeriroy title="Creator Name" descripation="@nickname" />
        <BoxDetailTeriroy title="Creator Name" descripation="@nickname" />

        <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
          <BoxDetailTeriroy
            title="Twitter Follower Range"
            descripation="5000"
          />
          <BoxDetailTeriroy
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
        <BoxDetailTeriroy
          title="Main Contact Discord"
          descripation="@nickname"
        />
        <BoxDetailTeriroy
          title="Discord URL"
          descripation="https://discord.com/link"
        />
        <BoxDetailTeriroy
          title="Main Contact Email"
          descripation="hello@email.com"
        />
      </View>
    </View>
  );
};
