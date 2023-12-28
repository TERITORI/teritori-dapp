import React from "react";
import { Image, FlatList, View } from "react-native";

import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";
import breedSVG from "../../../assets/game/breed.svg";
import defaultInventoryItemPNG from "../../../assets/game/default-inventory-item.png";
import addCircleFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useIsMobile } from "../../hooks/useIsMobile";
import { isNFTStaked } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium32 } from "../../utils/style/fonts";
import { layout, MOBILE_MAX_WIDTH } from "../../utils/style/layout";

export const RiotGameInventoryScreen = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const { myAvailableRippers } = useRippers();

  const gotoBreeding = () => {
    navigation.navigate("RiotGameBreeding");
  };

  return (
    <GameContentView>
      <FlexRow breakpoint={MOBILE_MAX_WIDTH} justifyContent="space-around">
        <View style={{ opacity: 0.6, marginTop: layout.spacing_x4 }}>
          <FlexRow
            breakpoint={MOBILE_MAX_WIDTH}
            justifyContent="space-between"
            alignItems="center"
          >
            <BrandText style={fontMedium32}>Available Items</BrandText>

            <CustomPressable>
              {({ hovered }): React.ReactElement => (
                <PrimaryButtonOutline
                  style={{
                    margin: layout.spacing_x1,
                  }}
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
            key={`items-selector-col-buster-${isMobile}`}
            numColumns={isMobile ? 2 : 3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => "" + index}
            renderItem={() => {
              return (
                <TertiaryBox
                  style={{
                    width: 150,
                    height: 150,
                    margin: layout.spacing_x1,
                  }}
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

        <View style={{ minWidth: 500, marginTop: layout.spacing_x4 }}>
          <FlexRow
            breakpoint={MOBILE_MAX_WIDTH}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <BrandText style={fontMedium32}>Available Rippers</BrandText>
            <PrimaryButtonOutline
              style={{
                margin: layout.spacing_x1,
              }}
              onPress={gotoBreeding}
              color={yellowDefault}
              size="SM"
              text="Breed"
              iconSVG={breedSVG}
            />
          </FlexRow>

          <FlatList
            data={myAvailableRippers}
            key={`rippers-selector-col-buster-${isMobile}`}
            numColumns={isMobile ? 2 : 3}
            style={{ height: 360 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(ripper) => ripper.id}
            renderItem={({ item: ripper }) => {
              return (
                <TertiaryBox
                  style={{ width: 150, height: 150, margin: layout.spacing_x1 }}
                >
                  <RipperAvatar
                    size={132}
                    source={ripper.imageUri}
                    isStaked={isNFTStaked(ripper)}
                  />
                </TertiaryBox>
              );
            }}
          />
        </View>
      </FlexRow>
    </GameContentView>
  );
};
