import React from "react";
import { StyleSheet } from "react-native";

import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  yellowDefault,
  neutral33,
  secondaryColor,
  orangeLight,
  withAlpha,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

interface RipperSlotProps {
  ripper: NSRiotGame.Ripper;
  isLeader?: boolean;
}

export const RipperSlot: React.FC<RipperSlotProps> = ({ ripper, isLeader }) => {
  return (
    <TertiaryBox
      width={172}
      height={148}
      mainContainerStyle={{
        padding: 16,
        borderRadius: 8,
        borderColor: isLeader ? yellowDefault : neutral33,
        borderWidth: isLeader ? 1.2 : 1,
      }}
    >
      <SVG
        source={addSVG}
        width={20}
        height={20}
        fontSize={4}
        color={isLeader ? yellowDefault : secondaryColor}
      />
      {isLeader && (
        <BrandText style={styles.leaderTitle}>Squad Leader</BrandText>
      )}
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  leaderTitle: {
    position: "absolute",
    bottom: 20,
    color: yellowDefault,
    backgroundColor: withAlpha(orangeLight, 0.1),
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 100,
    ...(fontSemibold13 as object),
  },
});
