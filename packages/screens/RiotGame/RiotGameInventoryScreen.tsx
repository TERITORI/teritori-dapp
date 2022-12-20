import React from "react";
import { Image, FlatList } from "react-native";

import breedSVG from "../../../assets/game/breed.svg";
import defaultInventoryItemPNG from "../../../assets/game/default-inventory-item.png";
import addCircleFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";

export const RiotGameInventoryScreen = () => {
  const navigation = useAppNavigation();

  const { myAvailableRippers } = useRippers();

  const gotoBreeding = () => {
    navigation.navigate("RiotGameBreeding");
  };

  return (
    <GameContentView>
      <Row breakpoint={1200} justifyContent="space-around">
        <Col style={{ opacity: 0.6, marginTop: layout.padding_x4 }}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <BrandText style={fontMedium32}>Available Items</BrandText>

            <CustomPressable>
              {({ hovered }): React.ReactElement => (
                <PrimaryButtonOutline
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
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => "" + index}
            renderItem={({ item, index }) => {
              return (
                <TertiaryBox
                  style={{ margin: layout.padding_x1 }}
                  width={150}
                  height={150}
                >
                  <Image
                    style={{ width: 60, height: 90 }}
                    source={defaultInventoryItemPNG}
                  />
                </TertiaryBox>
              );
            }}
          />
        </Col>

        <Col style={{ minWidth: "500px", marginTop: layout.padding_x4 }}>
          <Row
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <BrandText style={fontMedium32}>Available Rippers</BrandText>
            <PrimaryButtonOutline
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
            style={{ height: 360 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(ripper) => ripper.id}
            renderItem={({ item: ripper }) => {
              return (
                <TertiaryBox
                  style={{ margin: layout.padding_x1 }}
                  width={150}
                  height={150}
                >
                  <RipperAvatar size={132} source={ripper.imageUri} />
                </TertiaryBox>
              );
            }}
          />
        </Col>
      </Row>
    </GameContentView>
  );
};
