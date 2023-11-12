import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { FightBossSection } from "./FightBossSection";
import { FightCountdownSection } from "./FightCountdownSection";
import { FightSquadSection } from "./FightSquadSection";
import { UnstakeModal } from "./UnstakeModal";
import FlexRow from "../../../components/FlexRow";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { TeritoriNftQueryClient } from "../../../contracts-clients/teritori-nft/TeritoriNft.client";
import { Squad } from "../../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetNonSigningCosmWasmClient } from "../../../networks";
import { squadWithdraw } from "../../../utils/game";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { fontMedium48 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { RipperLightInfo } from "../types";

type FightSectionProps = {
  squad: Squad;
  onCloseClaimModal: () => void;
  now: number;
  cooldown: number;
};

export const FightSection: React.FC<FightSectionProps> = ({
  squad,
  onCloseClaimModal,
  now,
  cooldown,
}) => {
  const [isUnstaking, setIsUnstaking] = useState(false);
  const { setToastError } = useFeedbacks();
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId;

  const { data: stakedRippers } = useQuery(
    ["stakedRippers", networkId, squad.nfts],
    async () => {
      if (!networkId) {
        return [];
      }

      if (squad.nfts.length === 0) {
        return [];
      }

      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);

      const nftInfos = await Promise.all(
        squad.nfts.map(async (nft) => {
          const nftClient = new TeritoriNftQueryClient(
            cosmwasmClient,
            nft.contract_addr,
          );
          return await nftClient.nftInfo({ tokenId: nft.token_id });
        }),
      );

      const stakedRippers: RipperLightInfo[] = nftInfos.map(
        ({ extension }) => ({
          imageUri: ipfsURLToHTTPURL(`${extension?.image}`),
          name: `${extension?.name}`,
        }),
      );

      return stakedRippers;
    },
    { staleTime: Infinity },
  );

  const unstake = async () => {
    const currentUser = selectedWallet?.userId;

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

      <FightSquadSection stakedRippers={stakedRippers || []} />

      <UnstakeModal
        onClose={onCloseClaimModal}
        squad={squad}
        visible={isShowClaimModal}
      />
    </FlexRow>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  section: {
    paddingHorizontal: layout.spacing_x4 * 2,
  },
});
