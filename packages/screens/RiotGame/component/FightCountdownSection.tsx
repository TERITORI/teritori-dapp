import moment from "moment";
import React, { useMemo } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import brokenBoxPNG from "../../../../assets/game/broken-box.png";
import clockSVG from "../../../../assets/game/clock.svg";
import countDownPNG from "../../../../assets/game/countdown.png";
import unstakeSVG from "../../../../assets/icons/unstake.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn } from "../../../components/spacer";
import { Squad } from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { StakingState } from "../../../utils/game";
import {
  neutral77,
  redDefault,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontSemibold20,
  fontSemibold14,
  fontMedium40,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type FightCountdownSectionProps = {
  unstake(): void;
  isUnstaking: boolean;
  squad: Squad;
  now: number;
  cooldown: number;
};

export const FightCountdownSection: React.FC<FightCountdownSectionProps> = ({
  unstake,
  isUnstaking,
  squad,
  now,
  cooldown,
}) => {
  const { remainingTime, stakingState } = useMemo(() => {
    let remainingTime = 0;
    let stakingState = StakingState.UNKNOWN;

    const startsAt = moment(squad.start_time * 1000);
    const endsAt = moment(squad.end_time * 1000);
    const completesAt = moment(startsAt).add(cooldown, "seconds");

    const nowDt = moment(now);

    if (nowDt.isAfter(startsAt) && nowDt.isBefore(endsAt)) {
      stakingState = StakingState.ONGOING;
      remainingTime = endsAt.diff(now);
    } else if (nowDt.isAfter(endsAt) && nowDt.isBefore(completesAt)) {
      stakingState = StakingState.RELAX;
      remainingTime = completesAt.diff(now);
    } else if (nowDt.isAfter(completesAt)) {
      stakingState = StakingState.COMPLETED;
    }

    return {
      remainingTime,
      stakingState,
    };
  }, [squad.start_time, squad.end_time, cooldown, now]);

  const isOnGoing = stakingState === StakingState.ONGOING;
  const isCompleted = stakingState === StakingState.COMPLETED;

  const countdownColor = isOnGoing ? redDefault : yellowDefault;
  const actionLabelColor = isCompleted ? yellowDefault : neutral77;
  const actionIconColor = isCompleted ? yellowDefault : neutral77;

  return (
    <ImageBackground
      source={brokenBoxPNG}
      resizeMode="stretch"
      style={{
        width: 480,
        height: 300,
        padding: layout.spacing_x3,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: layout.spacing_x4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
      >
        <SVG
          style={{
            marginRight: layout.spacing_x4,
            marginLeft: layout.spacing_x2,
          }}
          color={countdownColor}
          source={clockSVG}
        />

        <View>
          <BrandText style={fontSemibold20}>
            {isOnGoing ? "Remaining Fight Time" : "Relax Period"}
          </BrandText>

          <SpacerColumn size={1} />

          <BrandText
            style={[fontMedium40, { color: countdownColor, minWidth: 260 }]}
          >
            {isCompleted
              ? "Completed"
              : moment.utc(remainingTime).format("HH[h]mm[m]ss")}
          </BrandText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <Image style={{ width: 240, height: 140 }} source={countDownPNG} />

        <TouchableOpacity
          style={styles.actionsSection}
          disabled={isUnstaking || stakingState !== StakingState.COMPLETED}
          onPress={unstake}
        >
          <SVG color={actionIconColor} source={unstakeSVG} />
          <BrandText style={[styles.actionLabel, { color: actionLabelColor }]}>
            {isUnstaking ? "Unstaking..." : "Unstake"}
          </BrandText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  actionsSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    marginLeft: layout.spacing_x0_5,
    ...(fontSemibold14 as object),
  },
});
