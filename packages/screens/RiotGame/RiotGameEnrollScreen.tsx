import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { EnrollSlot } from "./component/EnrollSlot";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperGridSelectorModal";
import controllerSVG from "../../../assets/game/controller-yellow.svg";
import closeSVG from "../../../assets/icons/close.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { NFT } from "@/api/marketplace/v1/marketplace";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { LegacyTertiaryBox } from "@/components/boxes/LegacyTertiaryBox";
import { SimpleButton } from "@/components/buttons/SimpleButton";
import { TertiaryButton } from "@/components/buttons/TertiaryButton";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useRippers } from "@/hooks/riotGame/useRippers";
import { useSquadStakingConfig } from "@/hooks/riotGame/useSquadStakingConfig";
import { useSquadStakingSquads } from "@/hooks/riotGame/useSquadStakingSquads";
import {
  getSquadStakingSquadsV1QueryKey,
  useSquadStakingSquadsV1,
} from "@/hooks/riotGame/useSquadStakingSquadsV1";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  persistSquadPreset,
  selectSquadPresets,
} from "@/store/slices/squadPresets";
import { useAppDispatch } from "@/store/store";
import { getP2eClient } from "@/utils/backend";
import {
  estimateStakingDuration,
  getSquadPresetId,
  squadStake,
  squadWithdrawSeason1,
} from "@/utils/game";
import { web3ToWeb2URI } from "@/utils/ipfs";
import {
  neutral00,
  neutral33,
  secondaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import {
  fontMedium24,
  fontMedium32,
  fontMedium48,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const EMBEDDED_VIDEO_URI = web3ToWeb2URI(
  "ipfs://bafybeihfkmpunve47w4avfnuv3mfnsgoqclahpx54zj4b2ypve52iqmxsa",
);
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

export const RiotGameEnrollScreen: React.FC = () => {
  const isMobile = useIsMobile();
  const navigation = useAppNavigation();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [activeSquadId, setActiveSquadId] = useState<number>(1);
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const queryClient = useQueryClient();

  const videoRef = React.useRef<Video>(null);
  const isScreenFocused = useIsFocused();

  const { myAvailableRippers } = useRippers();

  const { data: squadStakingConfig } = useSquadStakingConfig(networkId);
  const { data: squads, isInitialLoading } = useSquadStakingSquads(
    selectedWallet?.userId,
  );

  const { data: squadSeason1 } = useSquadStakingSquadsV1(
    selectedWallet?.userId,
  );

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

  const squadPresetId = getSquadPresetId(selectedWallet?.userId, activeSquadId);

  useEffect(() => {
    setSelectedRippers([]);
    setSelectedSlot(undefined);
    setIsJoiningFight(false);
    setIsUnstaking(false);
  }, [networkId]);

  const availableForEnrollRippers = useMemo(() => {
    const selectedIds = selectedRippers.map((r) => r.id);

    return myAvailableRippers.filter((r) => !selectedIds.includes(r.id));
  }, [myAvailableRippers, selectedRippers]);

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

  const gotoCurrentFight = () => {
    navigation.replace("RiotGameFight");
  };

  const unstakeSeason1 = async () => {
    if (!selectedWallet) return;

    try {
      setIsUnstaking(true);

      await squadWithdrawSeason1(selectedWallet.userId);
      setToastSuccess({
        title: "Success",
        message: "Unstake successfully",
      });
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    } finally {
      await queryClient.invalidateQueries(
        getSquadStakingSquadsV1QueryKey(selectedWallet.userId),
      );
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

    const p2eClient = getP2eClient(selectedWallet?.networkId);
    if (!p2eClient) {
      return setToastError({
        title: "Error",
        message: "Failed to get P2E client",
      });
    }

    const currentSeason = await p2eClient.CurrentSeason({ networkId });
    if (currentSeason.isPre) {
      return setToastError({
        title: "Warning",
        message: "Season has not started yet",
      });
    }

    setIsJoiningFight(true);

    try {
      await squadStake(selectedWallet?.userId, selectedRippers);

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
    const squadPresetId = getSquadPresetId(selectedWallet?.userId, squadId);
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
      }),
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
      !isInitialLoading &&
      squadStakingConfig?.owner &&
      squads.length === squadStakingConfig.squadCountLimit
    ) {
      navigation.replace("RiotGameFight");
    }
  }, [
    isInitialLoading,
    navigation,
    squadStakingConfig?.owner,
    squadStakingConfig?.squadCountLimit,
    squads,
  ]);

  return (
    <GameContentView>
      <View>
        <BrandText
          style={[
            {
              alignSelf: "center",
            },
            isMobile ? fontSemibold28 : fontMedium48,
          ]}
        >
          Send to fight
        </BrandText>
      </View>

      <View
        style={{
          justifyContent: "space-around",
          margin: layout.spacing_x1_5,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <View style={[colStyles, { maxWidth: 575 }]}>
          <View
            style={{
              marginTop: layout.spacing_x1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={isMobile ? fontMedium24 : fontMedium32}>
              Enroll your Ripper(s)
            </BrandText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: layout.spacing_x3,
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
            key={`squad-selector-col-buster-${isMobile}`}
            numColumns={isMobile ? 2 : 3}
            keyExtractor={(item, index) => "" + index}
            ListFooterComponent={
              activeSquadId ? (
                <TertiaryButton
                  style={{ marginTop: layout.spacing_x2_5 }}
                  text={`Save as Squad ${activeSquadId}`}
                  size="XS"
                  onPress={() => saveSquadPreset(activeSquadId)}
                />
              ) : null
            }
            renderItem={({ item: slotId }) => (
              <View
                style={{
                  marginRight: layout.spacing_x2_5,
                  marginTop: layout.spacing_x2_5,
                }}
              >
                {selectedRippers[slotId] && (
                  <Pressable
                    style={{
                      position: "absolute",
                      right: layout.spacing_x1,
                      top: layout.spacing_x1,
                      zIndex: 1,
                    }}
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

        <View style={[colStyles, { maxWidth: 540 }]}>
          <View style={{ marginTop: layout.spacing_x1, width: "100%" }}>
            <BrandText style={isMobile ? fontMedium24 : fontMedium32}>
              Staking duration
            </BrandText>
          </View>

          <LegacyTertiaryBox
            mainContainerStyle={{
              padding: layout.spacing_x4,
              alignItems: "flex-start",
            }}
            style={{ marginTop: layout.spacing_x2 }}
            fullWidth
            height={148}
          >
            <BrandText style={isMobile ? fontSemibold20 : fontSemibold28}>
              {moment
                .utc(stakingDuration)
                .format("HH [hours] mm [minutes] ss [seconds]")}
            </BrandText>
          </LegacyTertiaryBox>

          <View
            style={{
              marginTop: layout.spacing_x2_5,
              alignSelf: "center",
              width: embeddedVideoWidth,
              height: embeddedVideoHeight,
            }}
          >
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
              marginVertical: layout.spacing_x4,
              marginRight: layout.spacing_x2,
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
          containerStyle={{ marginVertical: layout.spacing_x4 }}
          text="Join the Fight"
          loading={isJoiningFight}
        />
      </View>

      {squadSeason1 && (
        <SimpleButton
          disabled={isUnstaking}
          onPress={unstakeSeason1}
          containerStyle={{ marginVertical: layout.spacing_x2 }}
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

const colStyles: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
};
