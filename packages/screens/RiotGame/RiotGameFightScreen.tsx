import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import fightBgPNG from "../../../assets/game/fight-bg.png";
import victoryBgPNG from "../../../assets/game/victory-bg.png";
import addCircleSFilledVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import Row from "../../components/grid/Row";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { getRipperTokenId, StakingState } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium48 } from "../../utils/style/fonts";
import { headerHeight, layout } from "../../utils/style/layout";
import { FightBossSection } from "./component/FightBossSection";
import { FightCountdownSection } from "./component/FightCountdownSection";
import { FightSquadSection } from "./component/FightSquadSection";
import { GameContentView } from "./component/GameContentView";
import { UnstakeModal } from "./component/UnstakeModal";

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
  const [isUnstaking, setIsUnstaking] = useState(false);

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
      setIsUnstaking(true);

      await squadWithdraw(squadStakingClient);
      setIsShowClaimModal(true);
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const gotoMarketplace = () => {
    navigation.navigate("RiotGameMarketplace");
  };

  const onCloseClaimModal = () => {
    setIsShowClaimModal(false);
    setCurrentSquad(undefined);
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
      navigation.replace("RiotGameEnroll");
    }
  }, [isSquadLoaded, isStakingStateLoaded]);

  // Start the timer
  useEffect(() => {
    if (
      !isSquadLoaded ||
      !squadStakingConfig?.nft_contract ||
      !isLastStakeTimeLoaded
    )
      return;

    startStakingTimer(currentSquad, lastStakeTime, squadStakingConfig);
  }, [isSquadLoaded, isLastStakeTimeLoaded, squadStakingConfig?.nft_contract]);

  return (
    <GameContentView
      bgImage={
        stakingState === StakingState.ONGOING ? fightBgPNG : victoryBgPNG
      }
    >
      <BrandText style={styles.pageTitle}>
        {PAGE_TITLE_MAP[stakingState]}
      </BrandText>

      <View style={styles.contentContainer}>
        <Row style={{ justifyContent: "space-between" }} breakpoint={992}>
          <View style={styles.col}>
            <FightBossSection remainingPercentage={remainingPercentage} />
          </View>

          <View style={styles.col}>
            <FightSquadSection stakedRippers={stakedRippers} />
          </View>
        </Row>

        <FightCountdownSection
          isUnstaking={isUnstaking}
          remainingTime={remainingTime}
          currentSquad={currentSquad}
          stakingState={stakingState}
          unstake={unstake}
        />

        {stakingState === StakingState.RELAX && (
          <PrimaryButtonOutline
            style={{ margin: layout.padding_x2 }}
            onPress={gotoMarketplace}
            color={yellowDefault}
            size="M"
            text="Buy new one"
            iconSVG={addCircleSFilledVG}
          />
        )}
      </View>

      <UnstakeModal
        onClose={onCloseClaimModal}
        currentSquad={currentSquad}
        visible={isShowClaimModal}
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  contentContainer: {
    paddingHorizontal: headerHeight,
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: layout.padding_x4,
  },
});
