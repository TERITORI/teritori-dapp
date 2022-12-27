import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import fightBgPNG from "../../../assets/game/fight-bg.png";
import victoryBgPNG from "../../../assets/game/victory-bg.png";
import addCircleSFilledVG from "../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useGame } from "../../context/GameProvider";
import { NftInfoResponse } from "../../contracts-clients/teritori-nft/TeritoriNft.types";
import { Nft } from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { StakingState } from "../../utils/game";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../../utils/keplr";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { fontMedium48 } from "../../utils/style/fonts";
import { headerHeight, layout } from "../../utils/style/layout";
import { FightBossSection } from "./component/FightBossSection";
import { FightCountdownSection } from "./component/FightCountdownSection";
import { FightSquadSection } from "./component/FightSquadSection";
import { GameContentView } from "./component/GameContentView";
import { UnstakeModal } from "./component/UnstakeModal";
import { RipperLightInfo } from "./types";

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

  const [stakedRippers, setStakedRippers] = useState<RipperLightInfo[]>([]);

  const { playGameAudio, muteAudio, enteredInGame } = useGame();
  // When this screen is focused, unmute the game audio and play game audio (A kind of forcing audio to be heard)
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && enteredInGame) {
      muteAudio(false);
      playGameAudio();
    }
  }, [isFocused]);

  const {
    currentSquad,
    squadStakingConfig,
    currentUser,
    squadWithdraw,
    remainingTime,
    stakingState,
    startStakingTimer,
    lastStakeTime,
    isLastStakeTimeLoaded,
    isStakingStateLoaded,
    isSquadLoaded,
    setCurrentSquad,
  } = useSquadStaking();

  const fetchCurrentStakedRippers = async (currentStakedNfts: Nft[]) => {
    const client = await getNonSigningCosmWasmClient();

    const nftInfos: NftInfoResponse[] = await Promise.all(
      currentStakedNfts.map((nft) =>
        client.queryContractSmart(nft.contract_addr, {
          nft_info: { token_id: nft.token_id },
        })
      )
    );

    const stakedRippers: RipperLightInfo[] = nftInfos.map(({ extension }) => ({
      imageUri: ipfsURLToHTTPURL(`${extension?.image}`),
      name: `${extension?.name}`,
    }));

    setStakedRippers(stakedRippers);
  };

  const unstake = async () => {
    if (!currentUser) return;

    try {
      setIsUnstaking(true);

      await squadWithdraw(currentUser);
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
    if (!isSquadLoaded || !squadStakingConfig?.owner || !isLastStakeTimeLoaded)
      return;

    startStakingTimer(currentSquad, lastStakeTime, squadStakingConfig);
  }, [isSquadLoaded, isLastStakeTimeLoaded, squadStakingConfig?.owner]);

  useEffect(() => {
    if (!currentSquad?.nfts) return;

    fetchCurrentStakedRippers(currentSquad.nfts);
  }, [myAvailableRippers, currentSquad?.nfts.length]);

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
        <FlexRow justifyContent="space-between" breakpoint={992}>
          <View style={styles.col}>
            <FightBossSection />
          </View>

          <View style={styles.col}>
            <FightSquadSection stakedRippers={stakedRippers} />
          </View>
        </FlexRow>

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
