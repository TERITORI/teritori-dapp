import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { getRipperTokenId } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import {
  gameHighlight,
  neutral33,
  neutral77,
  neutralA3,
  redDefault,
  yellowDefault,
} from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import {
  fontMedium48,
  fontMedium24,
  fontBold9,
  fontMedium32,
  fontSemibold20,
  fontSemibold14,
  fontMedium13,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { ClaimModal } from "./component/ClaimModal";
import { FightProgressBar } from "./component/FightProgressBar";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";

const ENEMY_AVATAR_SIZE = 150;
const RIPPER_AVATAR_SIZE = 60;
const BOX_SIZE = [380, 310];

const FIGHT_STATE = {
  UNKNOWN: "unknown",
  ONGOING: "onGoing",
  RELAX: "relax",
  COMPLETED: "completed",
};

const RELAX_DURATION = 2 * 60 * 60 * 1000;

const PAGE_TITLE_MAP = {
  [FIGHT_STATE.UNKNOWN]: "There is no ongoing fight",
  [FIGHT_STATE.ONGOING]: "Ongoing fight",
  [FIGHT_STATE.RELAX]: "Relax time",
  [FIGHT_STATE.COMPLETED]: "Completed",
};

export const RiotGameFightScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { myRippers } = useRippers();
  const counterRef = useRef<NodeJS.Timer>();

  const [remainingTime, setRemainingTime] = useState(0);
  const [fightState, setFightState] = useState(FIGHT_STATE.UNKNOWN);
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);
  const { currentSquad, squadWithdraw } = useSquadStaking();

  const stakedRippers = useMemo(() => {
    return myRippers.filter((r) =>
      currentSquad?.token_ids.includes(getRipperTokenId(r))
    );
  }, [myRippers, currentSquad]);

  const unstake = async () => {
    try {
      await squadWithdraw();
      setToastSuccess({
        title: "Success",
        message: "Unstake successfully",
      });
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    }
  };

  const claimRewards = async () => {
    const res = await squadWithdraw();
    console.log(res);

    setIsShowClaimModal(true);
  };

  const updateFightState = () => {
    if (!currentSquad) return;

    const now = moment();
    const startsAt = moment(currentSquad?.start_time * 1000);
    const endsAt = moment(currentSquad?.end_time * 1000);
    const relaxEndsAt = moment(endsAt).add(RELAX_DURATION, "milliseconds");

    if (now.isAfter(relaxEndsAt)) {
      setFightState(FIGHT_STATE.COMPLETED);
    } else if (now.isAfter(endsAt)) {
      setFightState(FIGHT_STATE.RELAX);
      setRemainingTime(relaxEndsAt.diff(now));
    } else if (now.isAfter(startsAt)) {
      setFightState(FIGHT_STATE.ONGOING);
      setRemainingTime(endsAt.diff(now));
    } else {
      setFightState(FIGHT_STATE.UNKNOWN);
    }
  };

  const isOnGoing = fightState === FIGHT_STATE.ONGOING;
  const isRelax = fightState === FIGHT_STATE.RELAX;
  const isCompleted = fightState === FIGHT_STATE.COMPLETED;
  const isUnknown = fightState === FIGHT_STATE.UNKNOWN;

  const countdownColor = isOnGoing ? redDefault : yellowDefault;
  const actionLabelColor = isOnGoing ? neutral77 : yellowDefault;
  const actionIconColor = isOnGoing ? neutral77 : yellowDefault;

  const gotoMarketplace = () => {
    navigation.navigate("RiotGameMarketplace");
  };

  useEffect(() => {
    if (!currentSquad) return;
    if (counterRef.current) return;

    // Calculate current state and remaining time
    updateFightState(); // Call immediately for the first time
    counterRef.current = setInterval(updateFightState, 1000);

    return () => {
      counterRef.current && clearInterval(counterRef.current);
      counterRef.current = undefined;
    };
  }, [currentSquad]);

  if (isUnknown) {
    return (
      <GameContentView bgImage={defaultSendToFightPNG}>
        <BrandText style={[flex.alignSelfCenter, fontMedium48]}>
          {PAGE_TITLE_MAP[fightState]}
        </BrandText>
      </GameContentView>
    );
  }

  return (
    <GameContentView bgImage={defaultSendToFightPNG}>
      <BrandText style={[flex.alignSelfCenter, fontMedium48]}>
        {isOnGoing ? "Ongoing fight" : "Relax time"}
      </BrandText>

      <View style={styles.contentContainer}>
        <Row style={flex.justifyContentBetween} breakpoint={992}>
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
                data={stakedRippers}
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
          </View>
        </Row>

        {/* Countdown block */}
        <TertiaryBox
          fullWidth
          mainContainerStyle={styles.countDownSection}
          noBrokenCorners
        >
          <Row style={{ flex: 1 }} breakpoint={992}>
            <View style={{ flex: 2 }}>
              <BrandText style={fontSemibold20}>
                {isOnGoing ? "Remaining Fight Time" : "Relax Period"}
              </BrandText>
              <Row>
                <BrandText
                  style={[
                    fontMedium48,
                    { color: countdownColor, minWidth: 260 },
                  ]}
                >
                  {isCompleted
                    ? "Completed"
                    : moment.utc(remainingTime).format("HH[h]mm[m]ss")}
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
              <TouchableOpacity
                disabled={fightState !== FIGHT_STATE.COMPLETED}
                onPress={unstake}
              >
                <BrandText
                  style={[styles.actionLabel, { color: actionLabelColor }]}
                >
                  Unstake
                </BrandText>
              </TouchableOpacity>

              <View style={styles.divider} />

              <SVG color={actionIconColor} source={claimSVG} />
              <TouchableOpacity
                disabled={fightState !== FIGHT_STATE.COMPLETED}
                onPress={claimRewards}
              >
                <BrandText
                  style={[styles.actionLabel, { color: actionLabelColor }]}
                >
                  Claim
                </BrandText>
              </TouchableOpacity>
            </Row>
          </Row>
        </TertiaryBox>

        {isRelax && (
          <ButtonOutline
            style={layout.m_2}
            onPress={gotoMarketplace}
            color={yellowDefault}
            size="M"
            text="Buy new one"
            iconSVG={addCircleSFilledVG}
          />
        )}
      </View>

      <ClaimModal
        onClose={() => setIsShowClaimModal(false)}
        visible={isShowClaimModal}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
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
    marginHorizontal: 12,
  },
  countDownSection: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionsSection: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 2,
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
});
