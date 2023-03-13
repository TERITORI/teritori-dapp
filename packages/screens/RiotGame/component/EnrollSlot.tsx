import React from "react";
import { StyleSheet, Image, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import addSVG from "../../../../assets/icons/add.svg";
import { NFT } from "../../../api/marketplace/v1/marketplace";
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
import { layout, smallMobileWidth } from "../../../utils/style/layout";

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
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <TertiaryBox
        width={width < smallMobileWidth ? 160 : 172}
        height={width < smallMobileWidth ? 140 : 148}
        mainContainerStyle={{
          padding: layout.padding_x2,
          borderRadius: layout.padding_x1,
          borderColor: isLeader ? yellowDefault : neutral33,
          borderWidth: isLeader ? 1.2 : 1,
        }}
      >
        {ripper ? (
          <Image style={styles.ripperImage} source={{ uri: ripper.imageUri }} />
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
    paddingVertical: layout.padding_x0_5,
    paddingHorizontal: layout.padding_x1_5,
    borderRadius: 100,
    ...(fontSemibold13 as object),
  },
  ripperImage: {
    width: 120,
    height: 120,
  },
});
