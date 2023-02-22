import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import controllerSVG from "../../../assets/game/controller-yellow.svg";
import closeSVG from "../../../assets/icons/close.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { TertiaryButton } from "../../components/buttons/TertiaryButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import {
  persistSquadPreset,
  selectSquadPresets,
} from "../../store/slices/squadPresets";
import { useAppDispatch } from "../../store/store";
import { p2eBackendClient } from "../../utils/backend";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral00,
  neutral33,
  secondaryColor,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontMedium32,
  fontMedium48,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { EnrollSlot } from "./component/EnrollSlot";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperGridSelectorModal";
import { SimpleButton } from "./component/SimpleButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const EMBEDDED_VIDEO_URI =
  "https://bafybeigr4ib4hzwnnyz2fpwdatac2uhcvx4suzujzdotxwdy2cd7ylqneq.ipfs.nftstorage.link/";
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

export const RiotGameEnrollScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [activeSquadId, setActiveSquadId] = useState<number>(1);

  const videoRef = React.useRef<Video>(null);
  const isScreenFocused = useIsFocused();

  const { myAvailableRippers } = useRippers();
  const {
    squadStakingConfig,
    squadStake,
    estimateStakingDuration,
    isSquadsLoaded,
    squads,
    squadWithdrawSeason1,
    currentUser,
    squadSeason1,
    setSquadSeason1,
    getSquadPresetId,
  } = useSquadStaking();

  // Stop video when changing screen through react-navigation
  useEffect(() => {
    if (!isScreenFocused && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isScreenFocused]);

  const squadPresets = useSelector(selectSquadPresets);
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [selectedRippers, setSelectedRippers] = useState<NFT[]>([]);
  const [isJoiningFight, setIsJoiningFight] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const dispatch = useAppDispatch();

  const squadPresetId = useMemo(() => {
    return getSquadPresetId(activeSquadId);
  }, [activeSquadId, getSquadPresetId]);

  const availableForEnrollRippers = useMemo(() => {
    const selectedIds = selectedRippers.map((r) => r.id);

    return myAvailableRippers.filter((r) => !selectedIds.includes(r.id));
  }, [myAvailableRippers, selectedRippers]);

  const stakingDuration = useMemo<number>(() => {
    if (selectedRippers.length === 0 || !squadStakingConfig) return 0;

    return estimateStakingDuration(selectedRippers, squadStakingConfig);
  }, [estimateStakingDuration, selectedRippers, squadStakingConfig]);

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

  const gotoCurrentFight = () => {
    navigation.replace("RiotGameFight");
  };

  const unstakeSeason1 = async () => {
    if (!currentUser) return;

    try {
      setIsUnstaking(true);

      await squadWithdrawSeason1(currentUser);
      setToastSuccess({
        title: "Success",
        message: "Unstake successfully",
      });

      setSquadSeason1(undefined);
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const joinTheFight = async () => {
    if (!squadStakingConfig) {
      return setToastError({
        title: "Error",
        message: "Failed to load SquadStakingConfig",
      });
    }

    const currentSeason = await p2eBackendClient.CurrentSeason({});
    if (currentSeason.isPre) {
      return setToastError({
        title: "Warning",
        message: "Season has not started yet",
      });
    }

    setIsJoiningFight(true);

    try {
      await squadStake(selectedRippers);

      // Wait a little before redirection to be sure that we have passed the fight start time
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

  const loadSquadPreset = useCallback(async () => {
    if (!squadPresetId) return;

    const ripperIds = squadPresets[squadPresetId] || [];
    const presetRippers: NFT[] = [];

    for (const ripperId of ripperIds) {
      const ripper = myAvailableRippers.find((ar) => ar.id === ripperId);
      if (ripper) {
        presetRippers.push(ripper);
      }
    }

    setSelectedRippers(presetRippers);
  }, [squadPresets, squadPresetId, myAvailableRippers]);

  const saveSquadPreset = async (squadId: number) => {
    const squadPresetId = getSquadPresetId(squadId);
    if (!squadPresetId) {
      return setToastError({
        title: "Error",
        message: "failed to get squadPresetId",
      });
    }

    dispatch(
      persistSquadPreset({
        squadPresetId,
        ripperIds: selectedRippers.map((r) => r.id),
      })
    );

    setToastSuccess({
      title: "Success",
      message: `Saved as Squad ${squadId}`,
    });
  };

  useEffect(() => {
    loadSquadPreset();
  }, [loadSquadPreset]);

  useEffect(() => {
    if (
      isSquadsLoaded &&
      squadStakingConfig?.owner &&
      squads.length === squadStakingConfig.squad_count_limit
    ) {
      navigation.replace("RiotGameFight");
    }
  }, [
    isSquadsLoaded,
    navigation,
    squadStakingConfig?.owner,
    squadStakingConfig?.squad_count_limit,
    squads.length,
  ]);

  return (
    <GameContentView>
      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <View style={styles.enrollContainer}>
        <View style={[styles.col, { maxWidth: 575 }]}>
          <View
            style={{
              marginTop: layout.padding_x1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={fontMedium32}>Enroll your Ripper(s)</BrandText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: layout.padding_x2_5,
              }}
            >
              <SimpleButton
                text="Squad 1"
                size="XS"
                color={activeSquadId === 1 ? neutral00 : secondaryColor}
                bgColor={activeSquadId === 1 ? yellowDefault : neutral33}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                onPress={() => setActiveSquadId(1)}
              />
              <SimpleButton
                text="Squad 2"
                size="XS"
                color={activeSquadId === 2 ? neutral00 : secondaryColor}
                bgColor={activeSquadId === 2 ? yellowDefault : neutral33}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                onPress={() => setActiveSquadId(2)}
              />
            </View>
          </View>

          <FlatList
            scrollEnabled={false}
            data={RIPPER_SLOTS}
            numColumns={3}
            keyExtractor={(item, index) => "" + index}
            ListFooterComponent={
              activeSquadId ? (
                <TertiaryButton
                  style={{ marginTop: layout.padding_x2_5 }}
                  text={`Save as Squad ${activeSquadId}`}
                  size="XS"
                  onPress={() => saveSquadPreset(activeSquadId)}
                />
              ) : null
            }
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
        </View>

        <View style={[styles.col, { maxWidth: 540 }]}>
          <View style={{ marginTop: layout.padding_x1, width: "100%" }}>
            <BrandText style={fontMedium32}>Staking duration</BrandText>
          </View>

          <TertiaryBox
            mainContainerStyle={{
              padding: layout.padding_x4,
              alignItems: "flex-start",
            }}
            style={{ marginTop: layout.padding_x2 }}
            fullWidth
            height={148}
          >
            <BrandText style={fontSemibold28}>
              {moment
                .utc(stakingDuration)
                .format("HH [hours] mm [minutes] ss [seconds]")}
            </BrandText>
          </TertiaryBox>

          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={{ borderRadius: 25 }}
              source={{
                uri: EMBEDDED_VIDEO_URI,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {squads.length > 0 && (
          <SimpleButton
            onPress={gotoCurrentFight}
            containerStyle={{
              marginVertical: layout.padding_x4,
              marginRight: layout.padding_x2,
            }}
            text="Go to current Fight"
            loading={isJoiningFight}
            iconSVG={controllerSVG}
            outline
          />
        )}

        <SimpleButton
          disabled={selectedRippers.length === 0}
          onPress={joinTheFight}
          containerStyle={{ marginVertical: layout.padding_x4 }}
          text="Join the Fight"
          loading={isJoiningFight}
        />
      </View>

      {squadSeason1 && (
        <SimpleButton
          disabled={isUnstaking}
          onPress={unstakeSeason1}
          containerStyle={{ marginVertical: layout.padding_x2 }}
          text="Retrieve Season 1 Squad"
          loading={isUnstaking}
          outline
        />
      )}

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        onClose={hideRipperSelector}
        slotId={selectedSlot}
        availableRippers={availableForEnrollRippers}
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
  enrollContainer: {
    justifyContent: "space-around",
    marginTop: layout.padding_x1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  col: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  ripperSlot: {
    marginRight: layout.padding_x2_5,
    marginTop: layout.padding_x2_5,
  },
  videoContainer: {
    marginTop: layout.padding_x2_5,
    alignSelf: "center",
    width: embeddedVideoWidth,
    height: embeddedVideoHeight,
  },
  clearIcon: {
    position: "absolute",
    right: layout.padding_x1,
    top: layout.padding_x1,
    zIndex: 1,
  },
});
