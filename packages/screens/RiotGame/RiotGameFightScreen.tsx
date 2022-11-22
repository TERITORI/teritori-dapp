import React, { useMemo } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

import defaultGuardianSVG from "../../../assets/default-images/default-guardian-nft.png";
import clockSVG from "../../../assets/game/clock.svg";
import countDownPNG from "../../../assets/game/countdown.png";
import defaultEnemyPNG from "../../../assets/game/default-enemy.png";
import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import addCircleSFilledVG from "../../../assets/icons/add-circle-filled.svg";
import claimSVG from "../../../assets/icons/claim.svg";
import unstakeSVG from "../../../assets/icons/unstake.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import Row from "../../components/grid/Row";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import useRippers from "../../hooks/riotGame/useRippers";
import {
  gameHighlight,
  neutral33,
  neutral77,
  neutralA3,
  redDefault,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium24,
  fontBold9,
  fontMedium32,
  fontSemibold20,
  fontSemibold14,
  fontMedium14,
} from "../../utils/style/fonts";
import { FightProgressBar } from "./component/FightProgressBar";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";

const ENEMY_AVATAR_SIZE = 150;
const RIPPER_AVATAR_SIZE = 60;
const BOX_SIZE = [380, 310];

const FIGHT_STATE = {
  ONGOING: "onGoing",
  RELAX: "relax",
};

export const RiotGameFightScreen = () => {
  const { myRippers } = useRippers();
  const fightState = FIGHT_STATE.RELAX;
  const isOnGoing = fightState === FIGHT_STATE.ONGOING;
  const isRelax = !isOnGoing;

  const { countdownColor, actionLabelColor, actionIconColor } = useMemo(() => {
    return {
      countdownColor: isOnGoing ? redDefault : yellowDefault,
      actionLabelColor: isOnGoing ? neutral77 : yellowDefault,
      actionIconColor: isOnGoing ? neutral77 : yellowDefault,
    };
  }, [fightState]);

  return (
    <GameContentView bgImage={defaultSendToFightPNG}>
      <BrandText style={styles.pageTitle}>
        {isOnGoing ? "Ongoing fight" : "Relax time"}
      </BrandText>

      <View style={styles.contentContainer}>
        <Row style={styles.row} breakpoint={992}>
          <View style={styles.col}>
            <TertiaryBox
              noBrokenCorners
              width={BOX_SIZE[0]}
              height={BOX_SIZE[1]}
              mainContainerStyle={{
                padding: 24,
                borderWidth: 3,
              }}
            >
              <Image style={styles.enemyThumb} source={defaultEnemyPNG} />

              <BrandText style={fontMedium24}>Philipp Rustov</BrandText>

              <FightProgressBar
                containerStyle={{ marginVertical: 12 }}
                width={170}
                height={10}
                value={66}
              />

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
                scrollEnabled={false}
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
                        source={defaultGuardianSVG}
                        size={RIPPER_AVATAR_SIZE}
                        rounded
                      />

                      <BrandText style={[fontMedium14, { color: neutralA3 }]}>
                        #{ripper.id}
                      </BrandText>
                    </View>
                  );
                }}
              />
            </TertiaryBox>
          </View>
        </Row>

        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.countDownSection}
          noBrokenCorners
        >
          <Row breakpoint={992}>
            <View style={{ flex: 1 }}>
              <BrandText style={fontSemibold20}>
                {isOnGoing ? "Remaining Fight Time" : "Relax Period"}
              </BrandText>
              <Row>
                <BrandText style={[fontMedium48, { color: countdownColor }]}>
                  6h 47m 56s
                </BrandText>
                <SpacerRow size={2} />
                <SVG color={countdownColor} source={clockSVG} />
              </Row>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Image
                style={{ width: 200, height: 110 }}
                source={countDownPNG}
              />
            </View>

            <Row style={styles.actionsSection}>
              <View style={styles.divider} />

              <SVG color={actionIconColor} source={unstakeSVG} />
              <BrandText
                style={[styles.actionLabel, { color: actionLabelColor }]}
              >
                Unstake
              </BrandText>

              <View style={styles.divider} />

              <SVG color={actionIconColor} source={claimSVG} />
              <BrandText
                style={[styles.actionLabel, { color: actionLabelColor }]}
              >
                Claim
              </BrandText>
            </Row>
          </Row>
        </TertiaryBox>

        {isRelax && (
          <ButtonOutline
            style={styles.moreBtn}
            color={yellowDefault}
            size="M"
            text="Buy new one"
            iconSVG={addCircleSFilledVG}
          />
        )}
      </View>
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 80,
  },
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  row: {
    justifyContent: "space-between",
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
    marginHorizontal: 12,
  },
  countDownSection: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionsSection: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  actionLabel: {
    marginLeft: 5,
    ...(fontSemibold14 as object),
  },
  divider: {
    marginHorizontal: 40,
    height: 56,
    width: 1,
    backgroundColor: neutral33,
  },
  moreBtn: {
    marginTop: 20,
  },
});
