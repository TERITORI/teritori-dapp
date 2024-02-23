import React from "react";
import { View } from "react-native";

import { ValidatorVoteView } from "./ValidatorVoteView";
import validatorIconSVG from "../../../../../assets/default-images/validator-icon.svg";

import { Avatar } from "@/components/Avatar";
import { BrandText } from "@/components/BrandText";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";

export const ValidatorItem: React.FC<{ item: any }> = ({ item }) => {
  return (
    <>
      <View style={{ flexDirection: "row", width: 430 }}>
        <Avatar uri={item.profileImage} defaultIcon={validatorIconSVG} />
        <SpacerRow size={1} />

        <View>
          <BrandText style={fontSemibold14}>{item.name}</BrandText>
          <SpacerColumn size={1} />

          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            {`Voting Power ${item.voting_power}, ${item.time}`}
          </BrandText>
          <SpacerColumn size={1} />

          <ValidatorVoteView title={item.vote} />
        </View>
      </View>
    </>
  );
};
