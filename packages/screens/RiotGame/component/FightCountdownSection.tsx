import moment from "moment";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import clockSVG from "../../../../assets/game/clock.svg";
import countDownPNG from "../../../../assets/game/countdown.png";
import unstakeSVG from "../../../../assets/icons/unstake.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
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
import { layout } from "../../../utils/style/layout";

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
      <FlexRow style={{ flex: 1 }} breakpoint={992}>
        <View style={{ flex: 2 }}>
          <BrandText style={fontSemibold20}>
            {isOnGoing ? "Remaining Fight Time" : "Relax Period"}
          </BrandText>
          <FlexRow>
            <BrandText
              style={[fontMedium48, { color: countdownColor, minWidth: 260 }]}
            >
              {isCompleted
                ? "Completed"
                : moment.utc(remainingTime).format("HH[h]mm[m]ss")}
            </BrandText>
            <SpacerRow size={2} />
            <SVG color={countdownColor} source={clockSVG} />
          </FlexRow>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Image style={{ width: 152, height: 88 }} source={countDownPNG} />
        </View>

        <FlexRow style={styles.actionsSection}>
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
            </>
          )}
        </FlexRow>
      </FlexRow>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  countDownSection: {
    paddingVertical: layout.padding_x2_5,
    paddingHorizontal: layout.padding_x4,
    marginTop: layout.padding_x4,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  actionsSection: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 2,
  },
  actionLabel: {
    marginLeft: layout.padding_x0_5,
    ...(fontSemibold14 as object),
  },
  divider: {
    marginHorizontal: layout.padding_x4,
    height: 56,
    width: 1,
    backgroundColor: neutral33,
  },
});
