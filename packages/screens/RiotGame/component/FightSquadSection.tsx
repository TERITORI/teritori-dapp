import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { NFT } from "../../../api/marketplace/v1/marketplace";
import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../../components/spacer";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium32, fontMedium13 } from "../../../utils/style/fonts";
import { RipperAvatar } from "../component/RipperAvatar";

const RIPPER_AVATAR_SIZE = 60;

type FightSquadSectionProps = {
  stakedRippers: NFT[];
};

export const FightSquadSection: React.FC<FightSquadSectionProps> = ({
  stakedRippers,
}) => {
  return (
    <TertiaryBox
      width={380}
      height={310}
      noBrokenCorners
      mainContainerStyle={{
        padding: 24,
        borderWidth: 3,
      }}
    >
      <BrandText style={fontMedium32}>Your Squad</BrandText>

      <SpacerColumn size={2} />

      <FlatList
        data={stakedRippers}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(ripper) => ripper.id}
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
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  ripperInfo: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 12,
  },
});
