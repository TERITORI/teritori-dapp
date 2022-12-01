import React, { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import breedSVG from "../../../assets/game/breed.svg";
import defaultInventoryItemPNG from "../../../assets/game/default-inventory-item.png";
import addCircleFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import { fontMedium32 } from "../../utils/style/fonts";
import { spacing } from "../../utils/style/spacing";
import { BreedingModal } from "./component/BreedingModal";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";

export const RiotGameInventoryScreen = () => {
  const navigation = useAppNavigation();

  const { myAvailableRippers } = useRippers();
  const [isShowBreedingModal, setIsShowBreedingModal] = useState(false);

  const gotoBreeding = () => {
    navigation.navigate("RiotGameBreeding");
  };

  return (
    <GameContentView>
      <Row breakpoint={1200} style={styles.container}>
        <Col style={styles.overlay}>
          <Row style={[flex.justifyContentBetween, flex.alignItemsCenter]}>
            <BrandText style={fontMedium32}>Available Items</BrandText>

            <CustomPressable>
              {({ hovered }): React.ReactElement => (
                <ButtonOutline
                  disabled
                  color={yellowDefault}
                  size="SM"
                  text={hovered ? "Coming soon" : "Fusion"}
                  iconSVG={addCircleFilledSVG}
                />
              )}
            </CustomPressable>
          </Row>

          <FlatList
            data={Array(9).fill(0)}
            numColumns={3}
            renderItem={({ item, index }) => {
              return (
                <TertiaryBox style={spacing.m_1} width={150} height={150}>
                  <Image
                    style={{ width: 60, height: 90 }}
                    source={defaultInventoryItemPNG}
                  />
                </TertiaryBox>
              );
            }}
          />
        </Col>

        <Col>
          <Row style={[flex.justifyContentBetween, flex.alignItemsCenter]}>
            <BrandText style={fontMedium32}>Available Rippers</BrandText>
            <ButtonOutline
              onPress={gotoBreeding}
              color={yellowDefault}
              size="SM"
              text="Breed"
              iconSVG={breedSVG}
            />
          </Row>

          <FlatList
            data={myAvailableRippers}
            numColumns={3}
            renderItem={({ item: ripper }) => {
              return (
                <TertiaryBox style={spacing.m_1} width={150} height={150}>
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
  overlay: {
    // opacity: 0.5,
  },
});
