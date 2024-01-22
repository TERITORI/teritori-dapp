import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { LegacyTertiaryBox } from "../../../components/boxes/LegacyTertiaryBox";
import { isNFTStaked } from "../../../utils/game";
import {
  yellowDefault,
  neutral33,
  secondaryColor,
  orangeLight,
  withAlpha,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface EnrollSlotProps {
  isLeader?: boolean;
  ripper?: NFT | undefined;
  onPress?(): void;
}

export const EnrollSlot: React.FC<EnrollSlotProps> = ({
  onPress,
  ripper,
  isLeader,
}) => {
  const isStaked = isNFTStaked(ripper);
  const imageSize = 172 - layout.spacing_x2 * 2;

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <LegacyTertiaryBox
        width={172}
        height={148}
        mainContainerStyle={{
          padding: layout.spacing_x2,
          borderRadius: layout.spacing_x1,
          borderColor: isLeader ? yellowDefault : neutral33,
          borderWidth: isLeader ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <>
            <OptimizedImage
              style={[styles.ripperImage, isStaked && { opacity: 0.4 }]}
              sourceURI={ripper.imageUri}
              width={imageSize}
              height={imageSize}
            />

            {isStaked && (
              <BrandText style={styles.stakedTitle}>Staked</BrandText>
            )}
          </>
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
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  stakedTitle: {
    position: "absolute",
    top: 20,
    color: redDefault,
    backgroundColor: withAlpha(redDefault, 0.3),
    paddingVertical: layout.spacing_x0_5,
    paddingHorizontal: layout.spacing_x1_5,
    borderRadius: 100,
    ...(fontSemibold12 as object),
  },

  leaderTitle: {
    position: "absolute",
    bottom: 20,
    color: yellowDefault,
    backgroundColor: withAlpha(orangeLight, 0.3),
    paddingVertical: layout.spacing_x0_5,
    paddingHorizontal: layout.spacing_x1_5,
    borderRadius: 100,
    ...(fontSemibold12 as object),
  },
  ripperImage: {
    width: 120,
    height: 120,
  },
});
