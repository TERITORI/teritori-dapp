import React from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import gameBoxSVG from "../../../../assets/icons/game-box.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import Row from "../../../components/grid/Row";
import {
  yellowDefault,
  neutral33,
  secondaryColor,
  orangeLight,
  withAlpha,
  neutralA3,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold13 } from "../../../utils/style/fonts";
import { spacing } from "../../../utils/style/spacing";
import { RipperDetail } from "../types";

interface BreedingSlotProps {
  active?: boolean;
  ripper?: RipperDetail | undefined;
  breedingsLeft?: number;
  onPress?(): void;
}

export const BreedingSlot: React.FC<BreedingSlotProps> = ({
  onPress,
  ripper,
  breedingsLeft,
  active,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <TertiaryBox
        width={200}
        height={200}
        mainContainerStyle={{
          padding: 16,
          borderRadius: 8,
          borderColor: neutral33,
          borderWidth: active ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <>
            <Row style={styles.breedingsLeftTxt}>
              <SVG
                source={gameBoxSVG}
                width={16}
                height={16}
                color={secondaryColor}
              />
              <BrandText
                style={[{ color: neutralA3 }, fontMedium14, spacing.ml_1]}
              >
                Breedings left: {breedingsLeft}
              </BrandText>
            </Row>

            <Image
              style={styles.ripperImage}
              source={{ uri: ripper.imageURL }}
            />
          </>
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
  breedingsLeftTxt: {
    position: "absolute",
    zIndex: 1,
    top: 10,
    left: 10,
    width: "auto",
    alignItems: "center",
  },
  ripperImage: {
    width: 180,
    height: 180,
  },
});
