import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import breedSVG from "../../../assets/game/breed.svg";
import chevronDownLineSVG from "../../../assets/game/chevron-down-line.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { SpacerRow } from "../../components/spacer";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { neutral33, neutralA3, yellowDefault } from "../../utils/style/colors";
import {
  fontMedium14,
  fontMedium32,
  fontMedium48,
} from "../../utils/style/fonts";
import { BreedingModal } from "./component/BreedingResultModal";
import { BreedingSlot } from "./component/BreedingSlot";
import { GameContentView } from "./component/GameContentView";
import { InfoBox } from "./component/InfoBox";
import { RipperAvatar } from "./component/RipperAvatar";

export const RiotGameBreedingScreen = () => {
  const { myAvailableRippers } = useRippers();
  const [isShowBreedingModal, setIsShowBreedingModal] = useState(false);

  const doBreed = () => {
    setIsShowBreedingModal(true);
  };

  return (
    <GameContentView>
      <Row breakpoint={992} style={styles.container}>
        <Col style={{ alignItems: "center" }}>
          <BrandText style={[fontMedium48]}>Breeding</BrandText>

          <Row style={{ marginTop: 40 }}>
            <BreedingSlot />
            <SpacerRow size={3} />
            <BreedingSlot />
          </Row>

          <Row style={{ marginTop: 40 }}>
            <InfoBox size="LG" title="Price" content="10 $ATOM" width={180} />

            <InfoBox
              size="LG"
              title="Breeding Cooldown"
              content="00:00 AM"
              width={180}
            />

            <InfoBox
              size="LG"
              title="Bonus"
              content="Coming soon"
              width={180}
            />
          </Row>

          <View style={styles.chevronLine}>
            <SVG source={chevronDownLineSVG} color={neutral33} />
          </View>

          <ButtonOutline
            onPress={doBreed}
            color={yellowDefault}
            size="M"
            text="Breed my Rippers"
            iconSVG={breedSVG}
          />

          <BrandText
            style={[fontMedium14, { color: neutralA3, marginTop: 20 }]}
          >
            Legal phrase powered by Popipou
          </BrandText>
        </Col>
        <Col>
          <BrandText style={[fontMedium32]}>Available Rippers</BrandText>

          <FlatList
            data={myAvailableRippers}
            numColumns={3}
            keyExtractor={(ripper) => ripper.id}
            renderItem={({ item: ripper, index }) => {
              return (
                <TertiaryBox style={{ margin: 10 }} width={172} height={148}>
                  <RipperAvatar size={120} source={ripper.imageUri} />
                </TertiaryBox>
              );
            }}
          />
        </Col>
      </Row>

      <BreedingModal
        onClose={() => setIsShowBreedingModal(false)}
        visible={isShowBreedingModal}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    marginTop: 40,
  },
  chevronLine: {
    marginVertical: 20,
  },
});
