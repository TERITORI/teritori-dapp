import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import FlexRow from "../../../components/FlexRow";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { NftInfoResponse } from "../../../contracts-clients/teritori-nft/TeritoriNft.types";
import {
  Nft,
  Squad,
} from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../../../utils/keplr";
import { fontMedium48 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { RipperLightInfo } from "../types";
import { FightBossSection } from "./FightBossSection";
import { FightCountdownSection } from "./FightCountdownSection";
import { FightSquadSection } from "./FightSquadSection";
import { UnstakeModal } from "./UnstakeModal";

type FightSectionProps = {
  squad: Squad;
  currentUser: string | undefined;
  squadWithdraw: (user: string) => void;
  onCloseClaimModal: () => void;
  now: number;
  cooldown: number;
};

export const FightSection: React.FC<FightSectionProps> = ({
  squad,
  currentUser,
  squadWithdraw,
  onCloseClaimModal,
  now,
  cooldown,
}) => {
  const [isUnstaking, setIsUnstaking] = useState(false);
  const { setToastError } = useFeedbacks();
  const [stakedRippers, setStakedRippers] = useState<RipperLightInfo[]>([]);
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);

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

  useEffect(() => {
    fetchCurrentStakedRippers(squad.nfts);
  }, [squad.nfts]);

  return (
    <FlexRow
      justifyContent="space-between"
      style={styles.section}
      breakpoint={1200}
    >
      <FightBossSection />

      <FightCountdownSection
        unstake={unstake}
        isUnstaking={isUnstaking}
        squad={squad}
        now={now}
        cooldown={cooldown}
      />

      <FightSquadSection stakedRippers={stakedRippers} />

      <UnstakeModal
        onClose={onCloseClaimModal}
        squad={squad}
        visible={isShowClaimModal}
      />
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  section: {
    paddingHorizontal: layout.padding_x4 * 2,
  },
});
