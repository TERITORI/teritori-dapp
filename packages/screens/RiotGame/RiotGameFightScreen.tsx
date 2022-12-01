import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
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
// import claimSVG from "../../../assets/icons/claim.svg";
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
import { getRipperTokenId, StakingState } from "../../utils/game";
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
import { spacing } from "../../utils/style/spacing";
import { ClaimModal } from "./component/ClaimModal";
import { FightProgressBar } from "./component/FightProgressBar";
import { GameContentView } from "./component/GameContentView";
import { RipperAvatar } from "./component/RipperAvatar";

const ENEMY_AVATAR_SIZE = 150;
const RIPPER_AVATAR_SIZE = 60;
const BOX_SIZE = [380, 310];

const PAGE_TITLE_MAP = {
  [StakingState.UNKNOWN]: "There is no ongoing fight",
  [StakingState.ONGOING]: "Ongoing fight",
  [StakingState.RELAX]: "Relax time",
  [StakingState.COMPLETED]: "Completed",
};

export const RiotGameFightScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();
  const { myAvailableRippers } = useRippers();

  const [isShowClaimModal, setIsShowClaimModal] = useState(false);
  const {
    currentSquad,
    squadStakingConfig,
    squadStakingClient,
    squadWithdraw,
    remainingTime,
    remainingPercentage,
    stakingState,
    startStakingTimer,
    lastStakeTime,
    isLastStakeTimeLoaded,
    isStakingStateLoaded,
    isSquadLoaded,
    setCurrentSquad,
  } = useSquadStaking();

  const stakedRippers = useMemo(() => {
    return myAvailableRippers.filter((r) =>
      currentSquad?.token_ids.includes(getRipperTokenId(r))
    );
  }, [myAvailableRippers, currentSquad]);

  const unstake = async () => {
    if (!squadStakingClient) {
      return setToastError({
        title: "Error occurs",
        message: "squadStakingClient is not ready",
      });
    }

    try {
      await squadWithdraw(squadStakingClient);
      setCurrentSquad(undefined);
      setIsShowClaimModal(true);
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    }
  };

  const isOnGoing = stakingState === StakingState.ONGOING;
  const isRelax = stakingState === StakingState.RELAX;
  const isCompleted = stakingState === StakingState.COMPLETED;

  const countdownColor = isOnGoing ? redDefault : yellowDefault;
  const actionLabelColor = isOnGoing ? neutral77 : yellowDefault;
  const actionIconColor = isOnGoing ? neutral77 : yellowDefault;

  const gotoMarketplace = () => {
    navigation.navigate("RiotGameMarketplace");
  };

  const onCloseClaimModal = () => {
    navigation.navigate("RiotGameEnroll");
  };

  /*
  - If there is squad, in all case we need to keep the fight screen
  - If there is no squad:
    + If state is Completed/Unknown => go to enroll screen
    + If state is Relax => show fight screen with countdown base on lastStakeTime
  */
  useEffect(() => {
    if (
      isSquadLoaded &&
      !currentSquad &&
      isStakingStateLoaded &&
      [StakingState.COMPLETED, StakingState.UNKNOWN].includes(stakingState)
    ) {
      navigation.navigate("RiotGameEnroll");
    }
  }, [isSquadLoaded, isStakingStateLoaded]);

  // Start the timer
  useEffect(() => {
    if (!isSquadLoaded || !squadStakingConfig || !isLastStakeTimeLoaded) return;

    startStakingTimer(currentSquad, lastStakeTime, squadStakingConfig);
  }, [isSquadLoaded, isLastStakeTimeLoaded, squadStakingConfig]);

  if (!isSquadLoaded && !isStakingStateLoaded) {
    return (
      <GameContentView>
        <BrandText style={styles.pageTitle}>Loading...</BrandText>
      </GameContentView>
    );
  }

  return (
    <GameContentView bgImage={defaultSendToFightPNG}>
      <BrandText style={styles.pageTitle}>
        {PAGE_TITLE_MAP[stakingState]}
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
                value={100 - remainingPercentage}
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
              {currentSquad && (
                <>
                  <View style={styles.divider} />

                  <SVG color={actionIconColor} source={unstakeSVG} />
                  <TouchableOpacity
                    disabled={stakingState !== StakingState.COMPLETED}
                    onPress={unstake}
                  >
                    <BrandText
                      style={[styles.actionLabel, { color: actionLabelColor }]}
                    >
                      Unstake
                    </BrandText>
                  </TouchableOpacity>

                  {/* TODO: activate this block when V2
              <View style={styles.divider} />

              <SVG color={actionIconColor} source={claimSVG} />
              <TouchableOpacity
                disabled={stakingState !== StakingState.COMPLETED}
                onPress={claimRewards}
              >
                <BrandText
                  style={[styles.actionLabel, { color: actionLabelColor }]}
                >
                  Claim
                </BrandText>
              </TouchableOpacity>
               */}
                </>
              )}
            </Row>
          </Row>
        </TertiaryBox>

        {isRelax && (
          <ButtonOutline
            style={spacing.m_2}
            onPress={gotoMarketplace}
            color={yellowDefault}
            size="M"
            text="Buy new one"
            iconSVG={addCircleSFilledVG}
          />
        )}
      </View>

      <ClaimModal onClose={onCloseClaimModal} visible={isShowClaimModal} />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
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
