import React from "react";
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";

import { RipperAvatar } from "./RipperAvatar";
import brokenBoxPNG from "../../../../assets/game/broken-box.png";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium32, fontMedium13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { RipperLightInfo } from "../types";

const RIPPER_AVATAR_SIZE = 60;

type FightSquadSectionProps = {
  stakedRippers: RipperLightInfo[];
};

export const FightSquadSection: React.FC<FightSquadSectionProps> = ({
  stakedRippers,
}) => {
  return (
    <ImageBackground
      source={brokenBoxPNG}
      resizeMode="stretch"
      style={{
        width: 360,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        padding: layout.spacing_x3,
        marginTop: layout.spacing_x4,
      }}
    >
      <BrandText style={fontMedium32}>Your Squad</BrandText>

      <SpacerColumn size={2} />

      <FlatList
        data={stakedRippers}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item: ripper, index }) => {
          const isCenter = (index - 1) % 3 === 0;

          return (
            <View
              style={[
                styles.ripperInfo,
                isCenter && { marginTop: RIPPER_AVATAR_SIZE / 3 },
              ]}
            >
              <RipperAvatar
                source={ripper.imageUri}
                size={RIPPER_AVATAR_SIZE}
                rounded
              />

              <BrandText style={[fontMedium13, { color: neutralA3 }]}>
                {ripper.name}
              </BrandText>
            </View>
          );
        }}
      />
    </ImageBackground>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  ripperInfo: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: layout.spacing_x1_5,
  },
});
