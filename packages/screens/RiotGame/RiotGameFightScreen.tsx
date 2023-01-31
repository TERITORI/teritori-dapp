import React, { useEffect, useMemo, useState } from "react";

import addCircleSFilledSVG from "../../../assets/icons/add-circle-filled.svg";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { SpacerColumn } from "../../components/spacer";
import { Squad } from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { useSquadStaking } from "../../hooks/riotGame/useSquadStaking";
import { useAppNavigation } from "../../utils/navigation";
import { yellowDefault } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { FightSection } from "./component/FightSection";
import { FightSectionHeader } from "./component/FightSectionHeader";
import { GameContentView } from "./component/GameContentView";

const FIGHT_BG_URI =
  "https://bafybeidca53mhjmgmu4uer4u3pr6hyvardmnwzlvmaemvgzrwl7knup2e4.ipfs.nftstorage.link/";

export const RiotGameFightScreen = () => {
  const navigation = useAppNavigation();

  const {
    squads,
    squadStakingConfig,
    currentUser,
    squadWithdraw,
    isSquadsLoaded,
    fetchSquads,
  } = useSquadStaking();

  const [now, setNow] = useState<number>(0);

  const isCompleted = (squad: Squad) => now - squad.end_time * 1000 >= 0;

  const ongoingSquads = useMemo(
    () => squads.filter((m) => !isCompleted(m)),
    [now]
  );
  const completedSquads = useMemo(() => squads.filter(isCompleted), [now]);

  const gotoMarketplace = () => {
    navigation.navigate("RiotGameMarketplace");
  };

  const onCloseClaimModal = () => {
    fetchSquads(currentUser || "");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(+new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isSquadsLoaded && squadStakingConfig?.owner && squads.length === 0) {
      navigation.replace("RiotGameEnroll");
    }
  }, [isSquadsLoaded, squadStakingConfig?.owner, squads.length]);

  return (
    <GameContentView bgImageURI={FIGHT_BG_URI}>
      {squads.length === 0 && (
        <FightSectionHeader title="No fights" total={0} />
      )}

      {ongoingSquads.length > 0 && (
        <FightSectionHeader
          title="Ongoing fights"
          total={ongoingSquads.length}
          hasStakeButton={
            squads?.length < (squadStakingConfig?.squad_count_limit || 0)
          }
        />
      )}

      {ongoingSquads.map((squad) => {
        return (
          <FightSection
            key={squad.start_time}
            currentUser={currentUser}
            squadWithdraw={squadWithdraw}
            squad={squad}
            onCloseClaimModal={onCloseClaimModal}
            now={now}
            cooldown={squadStakingConfig?.cooldown_period || 0}
          />
        );
      })}

      <SpacerColumn size={2} />

      {completedSquads.length > 0 && (
        <FightSectionHeader
          title="Victories"
          total={completedSquads.length}
          hasStakeButton={
            squads?.length < (squadStakingConfig?.squad_count_limit || 0)
          }
        />
      )}

      {completedSquads.map((squad) => {
        return (
          <FightSection
            key={squad.start_time}
            currentUser={currentUser}
            squadWithdraw={squadWithdraw}
            squad={squad}
            onCloseClaimModal={onCloseClaimModal}
            now={now}
            cooldown={squadStakingConfig?.cooldown_period || 0}
          />
        );
      })}

      <PrimaryButtonOutline
        style={{
          alignSelf: "flex-end",
          marginTop: layout.padding_x1_5,
          paddingRight: 2 * layout.padding_x4,
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
