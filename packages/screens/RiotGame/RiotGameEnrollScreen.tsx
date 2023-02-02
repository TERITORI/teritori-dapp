import { useIsFocused } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import controllerSVG from "../../../assets/game/controller-yellow.svg";
import closeSVG from "../../../assets/icons/close.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { p2eBackendClient } from "../../utils/backend";
import { useAppNavigation } from "../../utils/navigation";
import {
  fontMedium32,
  fontMedium48,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { EnrollSlot } from "./component/EnrollSlot";
import { GameContentView } from "./component/GameContentView";
import { RipperSelectorModal } from "./component/RipperSelectorModalV2";
import { SimpleButton } from "./component/SimpleButton";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const EMBEDDED_VIDEO_URI =
  "https://bafybeid5x2gujvk3cggzz2qvewf6ykzie2iqb7ry4qtew63tolanerw4ja.ipfs.nftstorage.link/";
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

export const RiotGameEnrollScreen = () => {
  const navigation = useAppNavigation();
  const { setToastError, setToastSuccess } = useFeedbacks();

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
  } = useSquadStaking();

  // Stop video when changing screen through react-navigation
  useEffect(() => {
    if (!isScreenFocused && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isScreenFocused]);

  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [selectedRippers, setSelectedRippers] = useState<NFT[]>([]);
  const [isJoiningFight, setIsJoiningFight] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

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
        navigation.navigate("RiotGameFight");
      }, 1000);
    } catch (e: any) {
      setToastError({
        title: "Transaction Error",
        message: e.message,
      });
      setIsJoiningFight(false);
    }
  };

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
        <View style={styles.col}>
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
        </View>

        <View style={styles.col}>
          <BrandText style={styles.sectionTitle}>Staking duration</BrandText>

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
            text="Goto current Fight"
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
  sectionTitle: {
    marginTop: layout.padding_x1,
    ...(fontMedium32 as object),
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
    maxWidth: 548,
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
