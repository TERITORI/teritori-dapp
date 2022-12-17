import moment from "moment";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import clockSVG from "../../../../assets/game/clock.svg";
import countDownPNG from "../../../../assets/game/countdown.png";
import unstakeSVG from "../../../../assets/icons/unstake.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import Row from "../../../components/grid/Row";
import { SpacerRow } from "../../../components/spacer";
import { GetSquadResponse } from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { StakingState } from "../../../utils/game";
import {
  neutral33,
  neutral77,
  redDefault,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontMedium48,
  fontSemibold20,
  fontSemibold14,
} from "../../../utils/style/fonts";

type FightCountdownSectionProps = {
  isUnstaking: boolean;
  remainingTime: number;
  currentSquad: GetSquadResponse | undefined;
  stakingState: StakingState;
  unstake(): void;
};

export const FightCountdownSection: React.FC<FightCountdownSectionProps> = ({
  isUnstaking,
  remainingTime,
  currentSquad,
  stakingState,
  unstake,
}) => {
  const isOnGoing = stakingState === StakingState.ONGOING;
  const isCompleted = stakingState === StakingState.COMPLETED;

  const countdownColor = isOnGoing ? redDefault : yellowDefault;
  const actionLabelColor = isOnGoing ? neutral77 : yellowDefault;
  const actionIconColor = isOnGoing ? neutral77 : yellowDefault;

  return (
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
              style={[fontMedium48, { color: countdownColor, minWidth: 260 }]}
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
          <Image style={{ width: 152, height: 88 }} source={countDownPNG} />
        </View>

        <Row style={styles.actionsSection}>
          {currentSquad && (
            <>
              <View style={styles.divider} />

              <SVG color={actionIconColor} source={unstakeSVG} />
              <TouchableOpacity
                disabled={
                  isUnstaking ||
                  [StakingState.UNKNOWN, StakingState.ONGOING].includes(
                    stakingState
                  )
                }
                onPress={unstake}
              >
                <BrandText
                  style={[styles.actionLabel, { color: actionLabelColor }]}
                >
                  {isUnstaking ? "Unstaking..." : "Unstake"}
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
  );
};

const styles = StyleSheet.create({
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
