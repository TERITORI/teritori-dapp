import moment from "moment";
import React, {useEffect, useMemo, useState} from "react";
import {FlatList, Pressable, StyleSheet, TouchableOpacity, View} from "react-native";

import closeSVG from "../../../assets/icons/close.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { EmbeddedWeb } from "../../components/EmbeddedWeb";
import { SVG } from "../../components/SVG";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import FlexRow from "../../components/FlexRow";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { getRipperTokenId, StakingState } from "../../utils/game";
import { useAppNavigation, ScreenFC} from "../../utils/navigation";
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
import { RipperSelectorModal } from "./component/RipperSelectorModalV2";
import { SimpleButton } from "./component/SimpleButton";
import {GameScreen} from "./types";
import {ResizeMode, Video, } from "expo-av";
import {useGame} from "../../context/GameProvider";
import BO_DURING_FIGHT from "../../../assets/game/BO-DURING-THE-FIGHT-THE-RIOT-TORI-P2E.mp3";
import BO_PREPARE_FIGHT from "../../../assets/game/BO-PREPARE-THE-FIGHT-1-P2E-THE-RIOT-TORI.mp3";

const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
const embeddedVideoUri =
  "https://bafybeieid23jjpzug42y6u5au2noc6hpyayqd56udgvh7pfd45jeksykoe.ipfs.nftstorage.link/";
const embeddedVideoHeight = 267;
const embeddedVideoWidth = 468;

export const RiotGameEnrollScreen: ScreenFC<GameScreen.RiotGameEnroll> = ({route}) => {
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();

  const { myAvailableRippers } = useRippers();
  const {
    currentSquad,
    squadStakingConfig,
    squadStake,
    estimateStakingDuration,
    lastStakeTime,
    isLastStakeTimeLoaded,
    isSquadLoaded,
    updateStakingState,
    isStaking
  } = useSquadStaking();
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [selectedRippers, setSelectedRippers] = useState<NFT[]>([]);
  const [isJoiningFight, setIsJoiningFight] = useState(false);


  /////////////////////////////////:
  const videoRef = React.useRef<Video>(null);
  const [isVideoPlayed, setVideoPlayed] = useState(false)
  const [isVideoFullScreen, setVideoFullScreen] = useState(false)
  const {enteredInGame, stopAudio, playGameAudio, setEnteredInGame} = useGame()


  useEffect(() => {
    // console.log('enteredInGameenteredInGameenteredInGameenteredInGame', enteredInGame)
    if(enteredInGame) setVideoPlayed(true)
  }, [enteredInGame])


  // useAudioVideo()
  // console.log('propspropspropspropsprops', props)
  // console.log('props.route.name)', route.name)
  // const {playAudio} = useAudioVideo(
  // useLayoutEffect(() => {
  //   // playAudio()
  // })
  /////////////////////////////////:
  
  const availableForEnrollRippers = useMemo(() => {
    const selectedIds = selectedRippers.map((r) => r.id);

    return myAvailableRippers.filter((r) => !selectedIds.includes(r.id));
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

  // If we are in state Relax/Ongoing or there is squad => goto fight screen
  if(isStaking) navigation.replace("RiotGameFight");

  // Update staking state
  useEffect(() => {
    if (!isSquadLoaded || !isLastStakeTimeLoaded || !squadStakingConfig?.owner)
      return;

    updateStakingState(currentSquad, lastStakeTime, squadStakingConfig);
  }, [isSquadLoaded, isLastStakeTimeLoaded, squadStakingConfig?.owner]);

  return (
    <GameContentView>
      <View>
        <BrandText style={styles.pageTitle}>Send to fight</BrandText>
      </View>

      <FlexRow breakpoint={1080} style={styles.enrollContainer}>
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

          <TouchableOpacity
            style={styles.videoContainer}
                            onPress={() => {
                              setEnteredInGame(false)
                              setVideoFullScreen(true)
                              videoRef?.current?.presentFullscreenPlayer();


          }}>
            {/*<EmbeddedWeb*/}
            {/*  autoplay*/}
            {/*  uri={embeddedVideoUri}*/}
            {/*  width={embeddedVideoWidth}*/}
            {/*  height={embeddedVideoHeight}*/}
            {/*  borderRadius={25}*/}
            {/*/>*/}

            <Video
              ref={videoRef}
              style={{borderRadius: 25}}
              source={{
                uri: embeddedVideoUri,
              }}
              onFullscreenUpdate={() => {if(isVideoFullScreen) {
                setVideoFullScreen(false)
                setEnteredInGame(true)
              }}}
              // useNativeControls={isVideoFullScreen}
              shouldPlay={(enteredInGame && !isVideoFullScreen) || isVideoFullScreen}
              isMuted={!isVideoFullScreen}
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </TouchableOpacity>
        </View>
      </FlexRow>

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
