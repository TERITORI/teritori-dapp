import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { Separator } from "@/components/separators/Separator";
import { neutral17, neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const VoteTimeDetailsBox: React.FC<{
  submit_time: string;
  voting_start_time: string;
  deposit_end_time: string;
  voting_end_time: string;
}> = ({
  submit_time,
  voting_start_time,
  deposit_end_time,
  voting_end_time,
}) => {
  return (
    <PrimaryBox
      style={{
        borderRadius: layout.spacing_x1_5,
        borderWidth: 0,
        backgroundColor: neutral17,
        height: 64,
        width: 724,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <View>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutral77,
              },
            ]}
          >
            Submit Time
          </BrandText>
          <BrandText
            style={[
              fontSemibold13,
              {
                marginTop: layout.spacing_x0_25,
                color: secondaryColor,
              },
            ]}
          >
            {`${submit_time.slice(0, 10)} ${submit_time.slice(11, 16)} UTC`}
          </BrandText>
        </View>
        <Separator horizontal />

        <View>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutral77,
              },
            ]}
          >
            Deposit End Time
          </BrandText>
          <BrandText
            style={[
              fontSemibold13,
              {
                marginTop: layout.spacing_x0_25,
                color: secondaryColor,
              },
            ]}
          >
            {`${deposit_end_time.slice(0, 10)} ${deposit_end_time.slice(11, 16)} UTC`}
          </BrandText>
        </View>
        <Separator horizontal />

        <View>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutral77,
              },
            ]}
          >
            Voting Start
          </BrandText>
          <BrandText
            style={[
              fontSemibold13,
              {
                marginTop: layout.spacing_x0_25,
                color: secondaryColor,
              },
            ]}
          >
            {`${voting_start_time.slice(0, 10)} ${voting_start_time.slice(11, 16)} UTC`}
          </BrandText>
        </View>
        <Separator horizontal />

        <View>
          <BrandText
            style={[
              fontSemibold12,
              {
                color: neutral77,
              },
            ]}
          >
            Voting End
          </BrandText>
          <BrandText
            style={[
              fontSemibold13,
              {
                marginTop: layout.spacing_x0_25,
                color: secondaryColor,
              },
            ]}
          >
            {`${voting_end_time.slice(0, 10)} ${voting_end_time.slice(11, 16)} UTC`}
          </BrandText>
        </View>
      </View>
    </PrimaryBox>
  );
};
