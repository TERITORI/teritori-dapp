import React from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import gameBoxSVG from "../../../../assets/icons/game-box.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  yellowDefault,
  neutral33,
  secondaryColor,
  orangeLight,
  withAlpha,
  neutralA3,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface BreedingSlotProps {
  active?: boolean;
  ripper?: NFT | undefined;
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
          padding: layout.padding_x2,
          borderRadius: 8,
          borderColor: neutral33,
          borderWidth: active ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <>
            <FlexRow style={styles.breedingsLeftTxt}>
              <SVG
                source={gameBoxSVG}
                width={16}
                height={16}
                color={secondaryColor}
              />
              <BrandText
                style={[
                  { color: neutralA3, marginLeft: layout.padding_x1 },
                  fontMedium14,
                ]}
              >
                Breedings left: {breedingsLeft}
              </BrandText>
            </FlexRow>

            <Image
              style={styles.ripperImage}
              source={{ uri: ripper.imageUri }}
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
    paddingVertical: layout.padding_x0_5,
    paddingHorizontal: layout.padding_x1_5,
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
