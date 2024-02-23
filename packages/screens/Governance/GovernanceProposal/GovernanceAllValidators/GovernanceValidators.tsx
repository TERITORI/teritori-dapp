import React from "react";
import { View } from "react-native";

import { ValidatorItem } from "./ValidatorItem";

import { SpacerColumn } from "@/components/spacer";

const RowSplitValue = 3;

export const GovernanceValidators: React.FC<{
  validators: {
    profileImage: string;
    name: string;
    voting_power: string;
    time: string;
    vote: string;
  }[];
}> = ({ validators }) => {
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {validators.slice(0, RowSplitValue).map((item, index) => (
          <ValidatorItem item={item} />
        ))}
      </View>
      <SpacerColumn size={4} />

      <View style={{ flexDirection: "row" }}>
        {validators.slice(RowSplitValue).map((item, index) => (
          <ValidatorItem item={item} />
        ))}
      </View>
    </>
  );
};
