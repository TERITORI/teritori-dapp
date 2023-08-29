import React from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import gameBoxSVG from "../../../../assets/icons/game-box.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { isNFTStaked } from "../../../utils/game";
import {
  neutral33,
  secondaryColor,
  withAlpha,
  neutralA3,
  redDefault,
} from "../../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../../utils/style/fonts";
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
  const isStaked = isNFTStaked(ripper);
  const imageSize = 200 - layout.padding_x2 * 2;

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
            <FlexRow style={breedingsLeftTxtStyle}>
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

            <OptimizedImage
              style={[ripperImageStyle, isStaked && { opacity: 0.4 }]}
              sourceURI={ripper.imageUri}
              width={imageSize}
              height={imageSize}
            />

            {isStaked && <BrandText style={stakedTitleStyle}>Staked</BrandText>}
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

const stakedTitleStyle: TextStyle = {
  ...fontSemibold12,
  position: "absolute",
  top: 2 * layout.padding_x4,
  color: redDefault,
  backgroundColor: withAlpha(redDefault, 0.3),
  paddingVertical: layout.padding_x0_5,
  paddingHorizontal: layout.padding_x1_5,
  borderRadius: 100,
};
const breedingsLeftTxtStyle: ViewStyle = {
  position: "absolute",
  zIndex: 1,
  top: 10,
  left: 10,
  width: "auto",
  alignItems: "center",
};
const ripperImageStyle: ImageStyle = {
  width: 180,
  height: 180,
};
