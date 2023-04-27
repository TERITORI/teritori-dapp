import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
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
  const imageSize = 172 - layout.padding_x2 * 2;

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <TertiaryBox
        width={172}
        height={148}
        mainContainerStyle={{
          padding: layout.padding_x2,
          borderRadius: layout.padding_x1,
          borderColor: isLeader ? yellowDefault : neutral33,
          borderWidth: isLeader ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <>
            <OptimizedImage
              style={[styles.ripperImage, isStaked && { opacity: 0.4 }]}
              source={{ uri: ripper.imageUri }}
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
      </TertiaryBox>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stakedTitle: {
    position: "absolute",
    top: 20,
    color: redDefault,
    backgroundColor: withAlpha(redDefault, 0.3),
    paddingVertical: layout.padding_x0_5,
    paddingHorizontal: layout.padding_x1_5,
    borderRadius: 100,
    ...(fontSemibold12 as object),
  },

  leaderTitle: {
    position: "absolute",
    bottom: 20,
    color: yellowDefault,
    backgroundColor: withAlpha(orangeLight, 0.3),
    paddingVertical: layout.padding_x0_5,
    paddingHorizontal: layout.padding_x1_5,
    borderRadius: 100,
    ...(fontSemibold12 as object),
  },
  ripperImage: {
    width: 120,
    height: 120,
  },
});
