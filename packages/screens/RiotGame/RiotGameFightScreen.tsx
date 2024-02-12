import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FightSection } from "./component/FightSection";
import { FightSectionHeader } from "./component/FightSectionHeader";
import { GameContentView } from "./component/GameContentView";
import addCircleSFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useSquadStakingConfig } from "@/hooks/riotGame/useSquadStakingConfig";
import { useSquadStakingSquads } from "@/hooks/riotGame/useSquadStakingSquads";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { yellowDefault } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { SquadInfo } from "@/utils/types/riot-p2e";

const FIGHT_BG_URI =
  "https://bafybeigv6eunkzlb4a7je6c5ezrcxgr2bv2guuwogin6mbsmdl2i6mgvwq.ipfs.cf-ipfs.com/";

export const RiotGameFightScreen = () => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();

  const { data: squadStakingConfig } = useSquadStakingConfig(networkId);
  const {
    data: squads,
    isInitialLoading,
    refetch: fetchSquads,
  } = useSquadStakingSquads(selectedWallet?.userId);
  const isSquadsLoaded = !!isInitialLoading;

  const [now, setNow] = useState<number>(0);

  const isCompleted = useCallback(
    (squad: SquadInfo) => now - squad.endTime * 1000 >= 0,
    [now],
  );

  const ongoingSquads = useMemo(
    () => squads.filter((m) => !isCompleted(m)),
    [isCompleted, squads],
  );
  const completedSquads = useMemo(
    () => squads.filter(isCompleted),
    [isCompleted, squads],
  );

  const gotoMarketplace = () => {
    navigation.navigate("RiotGameMarketplace");
  };

  const onCloseClaimModal = () => {
    fetchSquads();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const focusEffect = useCallback(() => {
    if (isSquadsLoaded && squadStakingConfig?.owner && squads.length === 0) {
      navigation.replace("RiotGameEnroll");
    }
  }, [isSquadsLoaded, navigation, squadStakingConfig?.owner, squads.length]);
  useFocusEffect(focusEffect);

  return (
    <GameContentView bgImage={{ uri: FIGHT_BG_URI }}>
      {squads.length === 0 && (
        <FightSectionHeader title="No fights" total={0} />
      )}

      {ongoingSquads.length > 0 && (
        <FightSectionHeader
          title="Ongoing fights"
          total={ongoingSquads.length}
          hasStakeButton={
            squads?.length < (squadStakingConfig?.squadCountLimit || 0)
          }
        />
      )}

      {ongoingSquads.map((squad) => {
        return (
          <FightSection
            key={squad.startTime}
            squad={squad}
            onCloseClaimModal={onCloseClaimModal}
            now={now}
            cooldown={squadStakingConfig?.cooldownPeriod || 0}
          />
        );
      })}

      <SpacerColumn size={2} />

      {completedSquads.length > 0 && (
        <FightSectionHeader
          title="Victories"
          total={completedSquads.length}
          hasStakeButton={
            squads?.length < (squadStakingConfig?.squadCountLimit || 0)
          }
        />
      )}

      {completedSquads.map((squad) => {
        return (
          <FightSection
            key={squad.startTime}
            squad={squad}
            onCloseClaimModal={onCloseClaimModal}
            now={now}
            cooldown={squadStakingConfig?.cooldownPeriod || 0}
          />
        );
      })}

      <PrimaryButtonOutline
        touchableStyle={{
          alignSelf: "flex-end",
          marginTop: layout.spacing_x1_5,
          paddingRight: 2 * layout.spacing_x4,
        }}
        style={{
          paddingRight: 2 * layout.spacing_x4,
        }}
        onPress={gotoMarketplace}
        color={yellowDefault}
        size="M"
        text="Buy new one"
        iconSVG={addCircleSFilledSVG}
        noBrokenCorners
      />
    </GameContentView>
  );
};
