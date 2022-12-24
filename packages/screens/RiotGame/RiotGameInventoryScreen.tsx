import React from "react";
import { Image, FlatList, View } from "react-native";

import breedSVG from "../../../assets/game/breed.svg";
import defaultInventoryItemPNG from "../../../assets/game/default-inventory-item.png";
import addCircleFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { useGame } from "../../context/GameProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";
import { GameScreen } from "./types";

export const RiotGameInventoryScreen: ScreenFC<
  GameScreen.RiotGameInventory
> = () => {
  const navigation = useAppNavigation();

  const { myAvailableRippers } = useRippers();
  const { playGameAudio, stopMemoriesVideos } = useGame();

  const gotoBreeding = () => {
    navigation.navigate("RiotGameBreeding");
  };

  return (
    <GameContentView>
      <FlexRow breakpoint={1200} justifyContent="space-around">
        <View
          style={{ opacity: 0.6, marginTop: layout.padding_x4 }}
          onLayout={() => {
            stopMemoriesVideos();
            playGameAudio();
          }}
        >
          <FlexRow justifyContent="space-between" alignItems="center">
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
          </FlexRow>

          <FlatList
            data={Array(9).fill(0)}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => "" + index}
            renderItem={() => {
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
        </View>

        <View style={{ minWidth: "500px", marginTop: layout.padding_x4 }}>
          <FlexRow
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
          </FlexRow>

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
        </View>
      </FlexRow>
    </GameContentView>
  );
};
