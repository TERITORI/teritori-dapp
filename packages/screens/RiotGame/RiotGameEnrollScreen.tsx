import { calculateFee } from "cosmwasm";
import moment from "moment";
import React, { useState, useMemo, useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";

import defaultSendToFightPNG from "../../../assets/game/default-video-send-to-fight.png";
import closeSVG from "../../../assets/icons/close.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import Col from "../../components/grid/Col";
import Row from "../../components/grid/Row";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { GetSquadResponse } from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import useRippers from "../../hooks/riotGame/useRippers";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  buildApproveMsg,
  buildStakingMsg,
  calculateStakingDuration,
} from "../../utils/game";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { useAppNavigation } from "../../utils/navigation";
import { neutralA3 } from "../../utils/style/colors";
import {
  fontMedium48,
  fontMedium32,
  fontSemibold28,
  fontMedium14,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { teritoriGasPrice } from "../../utils/teritori";
import { EnrollSlot } from "./component/EnrollSlot";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperSelectorModalOld";
import { SimpleButton } from "./component/SimpleButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];

export const RiotGameEnrollScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const sender = selectedWallet?.address || "";

  const { myRippers, squadStakingQueryClient } = useRippers();
  const [stakedRipperIds, setStakedRipperIds] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [selectedRippers, setSelectedRippers] = useState<
    NSRiotGame.RipperDetail[]
  >([]);
  const [isJoiningFight, setIsJoiningFight] = useState(false);

  const availableRippers = useMemo(() => {
    const selectedIds = selectedRippers.map((r) => r.name);
    return myRippers
      .filter((r) => !selectedIds.includes(r.name)) // excluded rippers already selected
      .filter((r) => !stakedRipperIds.includes(r.id.split("-")[2])); // excluded rippers already staked 
  }, [myRippers, selectedRippers, stakedRipperIds]);

  const stakingDuration = useMemo<number>(() => {
    return calculateStakingDuration(selectedRippers);
  }, [selectedRippers]);

  const showRipperSelector = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const hideRipperSelector = () => {
    setSelectedSlot(undefined);
  };

  const selectRipper = (slotId: number, ripper: NSRiotGame.RipperDetail) => {
    setSelectedSlot(undefined);
    setSelectedRippers([...selectedRippers, ripper]);
  };

  const clearSlot = (slotId: number) => {
    const newSelectedRippers = [...selectedRippers];
    newSelectedRippers.splice(slotId, 1);
    setSelectedRippers(newSelectedRippers);
  };

  const joinTheFight = async () => {
    if (selectedRippers.length === 0) return;

    setIsJoiningFight(true);
    const tokenIds = selectedRippers.map((r) => r.tokenId);

    try {
      const client = await getSigningCosmWasmClient();
      const sender = selectedWallet?.address || "";

      const approveMsgs = tokenIds.map((tokenId) =>
        buildApproveMsg(sender, tokenId)
      );

      const stakeMsg = buildStakingMsg(sender, tokenIds);
      const msgs = [...approveMsgs, stakeMsg];

      const estimate = await client.simulate(sender, msgs, "");
      const tx = await client.signAndBroadcast(
        sender,
        msgs,
        calculateFee(Math.floor(estimate * 1.3), teritoriGasPrice),
        defaultMemo
      );
      console.debug("Transaction:", tx);

      navigation.navigate("RiotGameFight");
    } catch (e: any) {
      console.error(e);
      setToastError({
        title: "Transaction Error",
        message: e.message,
      });
    } finally {
      setIsJoiningFight(false);
    }
  };

  const fetchStakedRippers = async () => {
    const squad: GetSquadResponse = await squadStakingQueryClient.getSquad({
      owner: sender,
    });

    setStakedRipperIds(squad.token_ids);
  };

  useEffect(() => {
    squadStakingQueryClient && fetchStakedRippers();
  }, [squadStakingQueryClient]);

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
              padding: 40,
              alignItems: "flex-start",
            }}
            style={layout.mt_2}
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
        onPress={joinTheFight}
        containerStyle={layout.mv_5}
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
    marginTop: 10,
    ...(fontMedium32 as object),
  },
  enrollContainer: {
    justifyContent: "space-around",
    marginTop: 10,
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
  },
  ripperSlot: {
    marginRight: 20,
    marginTop: 20,
  },
  placeholderVideo: {
    marginTop: 20,
    alignSelf: "center",
    width: 420,
    height: 240,
  },
  clearIcon: {
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 1,
  },
});
