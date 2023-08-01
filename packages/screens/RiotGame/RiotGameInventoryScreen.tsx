import React from "react";
import { Image, FlatList, View, StyleSheet } from "react-native";

import { ButtonGroup } from "./component/ButtonGroup";
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
import { isNFTStaked } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium32, fontMedium48 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const RiotGameInventoryScreen = () => {
  const navigation = useAppNavigation();

  const { myAvailableRippers } = useRippers();

  const gotoFusion = () => {
    navigation.navigate("RiotGameFusion");
  };

  return (
    <GameContentView>
      <BrandText style={styles.pageTitle}>Invetory</BrandText>

      <FlexRow
        breakpoint={1200}
        justifyContent="space-around"
        style={{ marginTop: layout.padding_x2 }}
      >
        <View>
          <FlexRow justifyContent="space-between" alignItems="center">
            <BrandText style={fontMedium32}>Available Items</BrandText>

            <ButtonGroup
              size="XS"
              buttons={[
                { text: "Boxes", onPress: () => {} },
                { text: "Keys", onPress: () => {} },
                { text: "Perks", onPress: () => {} },
              ]}
            />
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

        <View
          style={{
            minWidth: "500px",
            alignSelf: "flex-start",
          }}
        >
          <FlexRow
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <BrandText style={fontMedium32}>Available Rippers</BrandText>
            <PrimaryButtonOutline
              onPress={gotoFusion}
              color={yellowDefault}
              size="SM"
              text="Fusion"
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

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
});
