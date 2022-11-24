import React from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
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

interface BreedingSlotProps {
  active?: boolean;
  ripper?: NSRiotGame.Ripper | undefined;
  onPress?(): void;
}

export const BreedingSlot: React.FC<BreedingSlotProps> = ({
  onPress,
  ripper,
  active,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <TertiaryBox
        width={230}
        height={200}
        mainContainerStyle={{
          padding: 16,
          borderRadius: 8,
          borderColor: neutral33,
          borderWidth: active ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <Image style={styles.ripperImage} source={ripper.image} />
        ) : (
          <SVG
            source={addSVG}
            width={20}
            height={20}
            fontSize={4}
            color={secondaryColor}
          />
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
    width: 160,
    height: 160,
  },
});
