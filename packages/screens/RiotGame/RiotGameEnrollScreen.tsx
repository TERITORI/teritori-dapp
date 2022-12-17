import moment from "moment";
import React, { useState, useMemo, useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";

import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import closeSVG from "../../../assets/icons/close.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { getRipperTokenId, StakingState } from "../../utils/game";
import { useAppNavigation } from "../../utils/navigation";
import { neutralA3 } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium32,
  fontSemibold28,
  fontMedium14,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { EnrollSlot } from "./component/EnrollSlot";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperSelectorModalOld";
import { SimpleButton } from "./component/SimpleButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];

export const RiotGameEnrollScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();

  const { myAvailableRippers } = useRippers();
  const {
    currentSquad,
    squadStakingConfig,
    squadStake,
    stakingState,
    estimateStakingDuration,
    lastStakeTime,
    isStakingStateLoaded,
    isLastStakeTimeLoaded,
    isSquadLoaded,
    updateStakingState,
  } = useSquadStaking();
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [selectedRippers, setSelectedRippers] = useState<NFT[]>([]);
  const [isJoiningFight, setIsJoiningFight] = useState(false);

  const availableRippers = useMemo(() => {
    const selectedIds = selectedRippers.map(getRipperTokenId);
    const stakedIds = currentSquad?.token_ids || [];

    // excluded rippers already selected or staked
    return myAvailableRippers.filter((r) => {
      const tokenId = getRipperTokenId(r);
      return !selectedIds.includes(tokenId) && !stakedIds.includes(tokenId);
    });
  }, [myAvailableRippers, selectedRippers, currentSquad]);

  const stakingDuration = useMemo<number>(() => {
    if (selectedRippers.length === 0 || !squadStakingConfig) return 0;

    return estimateStakingDuration(selectedRippers, squadStakingConfig);
  }, [selectedRippers, squadStakingConfig]);

  const showRipperSelector = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const hideRipperSelector = () => {
    setSelectedSlot(undefined);
  };

  const selectRipper = (slotId: number, ripper: NFT) => {
    setSelectedSlot(undefined);
    setSelectedRippers([...selectedRippers, ripper]);
  };

  const clearSlot = (slotId: number) => {
    const newSelectedRippers = [...selectedRippers];
    newSelectedRippers.splice(slotId, 1);
    setSelectedRippers(newSelectedRippers);
  };

  const joinTheFight = async () => {
    if (!squadStakingConfig) {
      return setToastError({
        title: "Error",
        message: "Failed to load SquadStakingConfig",
      });
    }

    setIsJoiningFight(true);

    try {
      await squadStake(selectedRippers, squadStakingConfig);

      // HACK: wait a little bit before redirection to be sure that we have passed the fight start time
      setTimeout(() => {
        navigation.replace("RiotGameFight");
      }, 1000);
    } catch (e: any) {
      setToastError({
        title: "Transaction Error",
        message: e.message,
      });
      setIsJoiningFight(false);
    }
  };

  // If we are in state Relax/Ongoing or there is squad the goto fight screen
  useEffect(() => {
    if (
      isSquadLoaded &&
      isStakingStateLoaded &&
      (currentSquad ||
        [StakingState.RELAX, StakingState.ONGOING].includes(stakingState))
    ) {
      navigation.replace("RiotGameFight");
    }
  }, [isSquadLoaded, isStakingStateLoaded]);

  // Update staking state
  useEffect(() => {
    if (
      !isSquadLoaded ||
      !isLastStakeTimeLoaded ||
      !squadStakingConfig?.nft_contract
    )
      return;

    updateStakingState(currentSquad, lastStakeTime, squadStakingConfig);
  }, [isSquadLoaded, isLastStakeTimeLoaded, squadStakingConfig?.nft_contract]);

  return (
    <GameContentView>
      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <Row breakpoint={1080} style={styles.enrollContainer}>
        <Col style={styles.col}>
          <BrandText style={styles.sectionTitle}>
            Enroll your Ripper(s)
          </BrandText>

          <FlatList
            scrollEnabled={false}
            data={RIPPER_SLOTS}
            numColumns={3}
            keyExtractor={(item, index) => "" + index}
            renderItem={({ item: slotId }) => (
              <View style={styles.ripperSlot}>
                {selectedRippers[slotId] && (
                  <Pressable
                    style={styles.clearIcon}
                    onPress={() => clearSlot(slotId)}
                  >
                    <SVG width={20} height={20} source={closeSVG} />
                  </Pressable>
                )}
                <EnrollSlot
                  key={slotId}
                  isLeader={slotId === 0}
                  ripper={selectedRippers[slotId]}
                  onPress={() => showRipperSelector(slotId)}
                />
              </View>
            )}
          />
        </Col>

        <Col style={styles.col}>
          <BrandText style={styles.sectionTitle}>Staking duration</BrandText>

          <TertiaryBox
            mainContainerStyle={{
              padding: layout.padding_x4,
              alignItems: "flex-start",
            }}
            style={{ marginTop: layout.padding_x2 }}
            height={148}
          >
            <BrandText style={fontSemibold28}>
              {moment
                .utc(stakingDuration)
                .format("HH [hours] mm [minutes] ss [seconds]")}
            </BrandText>

            <SpacerColumn size={1} />

            <BrandText style={[fontMedium14, { color: neutralA3 }]}>
              Stamina x 0.2 for solo fights
            </BrandText>
            <BrandText style={[fontMedium14, { color: neutralA3 }]}>
              Leader's Stamina x 0.2 + Bonus for squad fights
            </BrandText>
          </TertiaryBox>

          <Image
            source={defaultSendToFightPNG}
            style={styles.placeholderVideo}
          />
        </Col>
      </Row>

      <SimpleButton
        disabled={selectedRippers.length === 0}
        onPress={joinTheFight}
        containerStyle={{ marginVertical: layout.padding_x4 }}
        title="Join the Fight"
        loading={isJoiningFight}
      />

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        onClose={hideRipperSelector}
        slotId={selectedSlot}
        availableRippers={availableRippers}
        onSelectRipper={selectRipper}
        confirmButton="Enroll this Ripper"
      />
    </GameContentView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  sectionTitle: {
    marginTop: layout.padding_x1,
    ...(fontMedium32 as object),
  },
  enrollContainer: {
    justifyContent: "space-around",
    marginTop: layout.padding_x1,
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
  },
  ripperSlot: {
    marginRight: layout.padding_x2_5,
    marginTop: layout.padding_x2_5,
  },
  placeholderVideo: {
    marginTop: layout.padding_x2_5,
    alignSelf: "center",
    width: 420,
    height: 240,
  },
  clearIcon: {
    position: "absolute",
    right: layout.padding_x1,
    top: layout.padding_x1,
    zIndex: 1,
  },
});
