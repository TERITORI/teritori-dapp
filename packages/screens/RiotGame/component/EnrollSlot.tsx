import React from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
import { RipperDetail } from "../types";

interface EnrollSlotProps {
  isLeader?: boolean;
  ripper?: RipperDetail | undefined;
  onPress?(): void;
}

export const EnrollSlot: React.FC<EnrollSlotProps> = ({
  onPress,
  ripper,
  isLeader,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
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
        {ripper ? (
          <Image style={styles.ripperImage} source={{ uri: ripper.imageURL }} />
        ) : (
          <SVG
            source={addSVG}
            width={20}
            height={20}
            fontSize={4}
            color={isLeader ? yellowDefault : secondaryColor}
          />
        )}
        {isLeader && (
          <BrandText style={styles.leaderTitle}>Squad Leader</BrandText>
        )}
      </TertiaryBox>
    </TouchableOpacity>
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
  ripperImage: {
    width: 120,
    height: 120,
  },
});
