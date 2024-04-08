import React from "react";
import { View } from "react-native";

import { VoteTimeText } from "./VoteTimeText";

import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { Separator } from "@/components/separators/Separator";
import { useIsMobile } from "@/hooks/useIsMobile";
import { neutral17 } from "@/utils/style/colors";
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
  const isMobile = useIsMobile();
  return (
    <PrimaryBox
      style={{
        borderRadius: layout.spacing_x1_5,
        borderWidth: 0,
        backgroundColor: neutral17,
        height: isMobile ? 120 : 64,
        width: isMobile ? "98%" : 724,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <VoteTimeText
          label="Submit Time"
          subLabel={`${submit_time.slice(0, 10)} ${submit_time.slice(11, 16)} UTC`}
        />
        <Separator horizontal />

        <VoteTimeText
          label="Deposit End Time"
          subLabel={`${deposit_end_time.slice(0, 10)} ${deposit_end_time.slice(11, 16)} UTC`}
        />
        {!isMobile && (
          <>
            <Separator horizontal />
            <VoteTimeText
              label="Voting Start"
              subLabel={`${voting_start_time.slice(0, 10)} ${voting_start_time.slice(11, 16)} UTC`}
            />
            <Separator horizontal />
            <VoteTimeText
              label="Voting End"
              subLabel={`${voting_end_time.slice(0, 10)} ${voting_end_time.slice(11, 16)} UTC`}
            />
          </>
        )}
      </View>
      {isMobile && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 15,
          }}
        >
          <VoteTimeText
            label="Voting Start"
            subLabel={`${voting_start_time.slice(0, 10)} ${voting_start_time.slice(11, 16)} UTC`}
          />
          <Separator horizontal />

          <VoteTimeText
            label="Voting End"
            subLabel={`${voting_end_time.slice(0, 10)} ${voting_end_time.slice(11, 16)} UTC`}
          />
        </View>
      )}
    </PrimaryBox>
  );
};
