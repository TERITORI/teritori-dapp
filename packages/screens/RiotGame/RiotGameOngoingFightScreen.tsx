import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import defaultGuardianNFT from "../../../assets/default-images/default-guardian-nft.png";
import defaultEnemyPNG from "../../../assets/game/default-enemy.png";
import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import { BrandText } from "../../components/BrandText";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../components/spacer";
import useRippers from "../../hooks/riotGame/useRippers";
import { gameHighlight, neutralA3 } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium24,
  fontBold9,
  fontMedium32,
} from "../../utils/style/fonts";
import GameContentView from "./component/GameContentView";

const ENEMY_AVATAR_SIZE = 150;
const RIPPER_AVATAR_SIZE = 90;
const BOX_SIZE = [380, 310];

export const RiotGameOngoingFightScreen = () => {
  const { width } = useWindowDimensions();
  const { myRippers } = useRippers();

  return (
    <GameContentView bgImage={defaultSendToFightPNG}>
      <BrandText style={styles.pageTitle}>Ongoing fight</BrandText>

      <View
        style={[styles.row, { flexDirection: width > 992 ? "row" : "column" }]}
      >
        <View style={styles.col}>
          <TertiaryBox
            width={BOX_SIZE[0]}
            height={BOX_SIZE[1]}
            noBrokenCorners
            mainContainerStyle={{
              padding: 24,
              borderWidth: 3,
            }}
          >
            <Image style={styles.enemyThumb} source={defaultEnemyPNG} />

            <BrandText style={fontMedium24}>Philipp Rustov</BrandText>
            <BrandText style={[fontBold9, { color: gameHighlight }]}>
              BEFORE THE END OF THE FIGHT...
            </BrandText>
          </TertiaryBox>
        </View>

        <View style={styles.col}>
          <TertiaryBox
            width={BOX_SIZE[0]}
            height={BOX_SIZE[1]}
            noBrokenCorners
            mainContainerStyle={{
              padding: 24,
              borderWidth: 3,
            }}
          >
            <BrandText style={fontMedium32}>Your Squad</BrandText>

            <SpacerColumn size={2} />

            <FlatList
              data={myRippers}
              numColumns={3}
              renderItem={({ item: ripper, index }) => {
                const isCenter = (index - 1) % 3 === 0;

                return (
                  <View
                    style={[
                      styles.ripperInfo,
                      isCenter && { marginTop: RIPPER_AVATAR_SIZE / 2 },
                    ]}
                  >
                    <View style={styles.roundedRipper}>
                      <Image
                        style={styles.ripperThumb}
                        source={defaultGuardianNFT}
                      />
                    </View>

                    <BrandText style={[fontMedium24, { color: neutralA3 }]}>
                      #{ripper.id}
                    </BrandText>
                  </View>
                );
              }}
            />
          </TertiaryBox>
        </View>
      </View>
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 80,
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  enemyThumb: {
    width: ENEMY_AVATAR_SIZE,
    height: ENEMY_AVATAR_SIZE,
  },
  ripperInfo: {
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
  },
  roundedRipper: {
    width: RIPPER_AVATAR_SIZE,
    height: RIPPER_AVATAR_SIZE,
    overflow: "hidden",
    borderRadius: RIPPER_AVATAR_SIZE,
  },
  ripperThumb: {
    width: "100%",
    height: "100%",
  },
});
