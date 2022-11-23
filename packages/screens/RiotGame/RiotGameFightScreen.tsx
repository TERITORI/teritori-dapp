import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

import defaultGuardianSVG from "../../../assets/default-images/default-guardian-nft.png";
import clockSVG from "../../../assets/game/clock.svg";
import countDownPNG from "../../../assets/game/countdown.png";
import defaultEnemyPNG from "../../../assets/game/default-enemy.png";
import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import trophiesSVG from "../../../assets/game/trophies.svg";
import addCircleSFilledVG from "../../../assets/icons/add-circle-filled.svg";
import claimSVG from "../../../assets/icons/claim.svg";
import twitterSVG from "../../../assets/icons/twitter.svg";
import unstakeSVG from "../../../assets/icons/unstake.svg";
import teritoriLogoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import { SocialButton } from "../../components/buttons/SocialButton";
import Row from "../../components/grid/Row";
import ModalBase from "../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import useRippers from "../../hooks/riotGame/useRippers";
import { useAppNavigation } from "../../utils/navigation";
import {
  gameHighlight,
  mineShaftColor,
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
  fontSemibold16,
} from "../../utils/style/fonts";
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

const FIGHT_DURATION = 5000;
const RELAX_DURATION = 5000;

const PAGE_TITLE_MAP = {
  [FIGHT_STATE.UNKNOWN]: "There is no ongoing fight",
  [FIGHT_STATE.ONGOING]: "Ongoing fight",
  [FIGHT_STATE.RELAX]: "Relax time",
  [FIGHT_STATE.COMPLETED]: "Completed",
};

export const RiotGameFightScreen = () => {
  const navigation = useAppNavigation();
  const { myRippers } = useRippers();

  // TODO: get theses values from servers
  const fightStartedAt = moment.utc();
  const fightEndedAt = moment(fightStartedAt).add(
    FIGHT_DURATION,
    "milliseconds"
  );
  const relaxStartedAt = fightEndedAt;
  const relaxEndedAt = moment(relaxStartedAt).add(
    RELAX_DURATION,
    "milliseconds"
  );

  const [remainingTime, setRemainingTime] = useState(0);
  const [fightState, setFightState] = useState(FIGHT_STATE.UNKNOWN);
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);

  const claimRewards = () => {
    setIsShowClaimModal(true);
  };

  const updateFightState = () => {
    const now = moment.utc();

    if (now.isAfter(relaxEndedAt)) {
      setFightState(FIGHT_STATE.COMPLETED);
    } else if (now.isAfter(relaxStartedAt)) {
      setFightState(FIGHT_STATE.RELAX);
      setRemainingTime(relaxEndedAt.diff(now));
    } else if (now.isAfter(fightStartedAt)) {
      setFightState(FIGHT_STATE.ONGOING);
      setRemainingTime(fightEndedAt.diff(now));
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

  useEffect(() => {
    // Calculate current state and remaining time
    updateFightState(); // Call immediately for the first time
    const countdownInterval = setInterval(updateFightState, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  if (isUnknown) {
    return (
      <GameContentView bgImage={defaultSendToFightPNG}>
        <BrandText style={styles.pageTitle}>
          {PAGE_TITLE_MAP[fightState]}
        </BrandText>
      </GameContentView>
    );
  }

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
              <BrandText
                style={[styles.actionLabel, { color: actionLabelColor }]}
              >
                Unstake
              </BrandText>

              <View style={styles.divider} />

              <SVG color={actionIconColor} source={claimSVG} />
              <BrandText
                onPress={claimRewards}
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

      <ModalBase
        contentStyle={{ alignItems: "center" }}
        label="Success Fight!"
        visible={isShowClaimModal}
        width={372}
        onClose={() => setIsShowClaimModal(false)}
        childrenBottom={
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: mineShaftColor,
              width: "100%",
              alignItems: "center",
              padding: 20,
            }}
          >
            <BrandText style={[fontSemibold16, { color: neutral77 }]}>
              Share with friends via
            </BrandText>

            <SpacerColumn size={2} />

            <SocialButton
              noBrokenCorners={false}
              iconSvg={twitterSVG}
              text="Twitter"
            />
          </View>
        }
      >
        <View style={{ alignItems: "center" }}>
          <SVG width={200} height={200} source={teritoriLogoSVG} />

          <SpacerColumn size={4} />

          <BrandText style={fontSemibold20}>ferryman.tori</BrandText>

          <SpacerColumn size={2} />

          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You made it to rank #1!
          </BrandText>

          <SpacerColumn size={2} />

          <Row>
            <SVG
              color={neutralA3}
              width={24}
              height={24}
              source={trophiesSVG}
            />

            <SpacerRow size={1} />

            <BrandText style={fontSemibold20}>1337 TORI</BrandText>
          </Row>

          <SpacerColumn size={4} />
        </View>
      </ModalBase>
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
