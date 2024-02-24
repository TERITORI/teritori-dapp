import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "../BrandText/BrandText";

import { neutral22, redDefault } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const getExpireDate = (votingEndTime: string): string => {
  const currentTime: Date = new Date();
  const endTime: Date = new Date(votingEndTime);
  const difference: number = endTime.getTime() - currentTime.getTime();
  const days: number = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours: number = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  if (days === 0) {
    return `Expires in ${hours}h`;
  } else {
    return `Expires in ${days}d ${hours}h`;
  }
};

export const GovernanceExpire: React.FC<{
  style?: StyleProp<ViewStyle>;
  votingEndTime: string;
}> = ({ votingEndTime, style }) => {
  return (
    <View style={[{ flexDirection: "row", gap: layout.spacing_x0_5 }, style]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: layout.spacing_x0_5,
          paddingRight: layout.spacing_x1,
          paddingLeft: layout.spacing_x0_5,
          backgroundColor: neutral22,
          borderRadius: layout.spacing_x0_75,
          gap: layout.spacing_x0_25,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            backgroundColor: redDefault,
            borderRadius: layout.spacing_x0_5,
          }}
        />

        <BrandText
          style={[
            fontSemibold12,
            {
              paddingLeft: layout.spacing_x0_5,
              color: redDefault,
            },
          ]}
        >
          {getExpireDate(votingEndTime)}
        </BrandText>
      </View>
    </View>
  );
};
